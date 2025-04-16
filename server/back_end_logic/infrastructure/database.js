import mysql from "mysql2/promise";
import crypto from "crypto"; // senerating token for email verification link
import bcrypt from "bcryptjs";

function formatDateForMySQL(date) {
  const d = new Date(date);
  return d.toISOString().slice(0, 19).replace('T', ' ');
}


export default class Database {
  constructor(config) {
    this.db = mysql.createPool({
      host: config.db.host,
      user: config.db.user,
      password: config.db.password,
      database: config.db.database
    });
  }

  async test_connection() {
    try {
      const connection = await this.db.getConnection();
      console.log("Connected to the MySQL database!");
      connection.release();
    } catch (error) {
      console.error("Error connecting to the database:", error.message);
    }
  }

  async get_verified_users(config) {
    if (!['username', 'email'].includes(config.queryType)) {
      console.log('Query type for get_verified_users must include username or email');
      return null;
    }

    const infoFields = config.fields.join(',');
    const query = `SELECT ${infoFields} FROM users WHERE ${config.queryType} = ?`;


    const [rows] = await this.db.query(query, [config.filter]);

    return rows;
  }

  async get_unverified_users(config) {
    if (!['username', 'email'].includes(config.queryType)) {
      console.log('Query type for get_unverified_users must be username or email');
      return null;
    }


    const infoFields = config.fields.join(',');

    const query = `SELECT ${infoFields} FROM unverified_users WHERE ${config.queryType} = ?`;

    const [rows] = await this.db.query(query, [config.filter]);

    return rows;
  }

  async is_username_registered(username) {
    const rows1 = await this.get_verified_users({ queryType: 'username', filter: username, fields: ['username'] });
    const rows2 = await this.get_unverified_users({ queryType: 'username', filter: username, fields: ['username'] });

    return rows1.length > 0 || rows2.length > 0;
  }

  async is_email_registered(email) {
    const rows1 = await this.get_verified_users({ queryType: 'email', filter: email, fields: ['email'] });
    const rows2 = await this.get_unverified_users({ queryType: 'email', filter: email, fields: ['email'] });

    return rows1.length > 0 || rows2.length > 0;
  }

  async register_user(config, cb) {
    const connection = await this.db.getConnection(); // Get a single connection
    await connection.beginTransaction(); // Start transaction

    try {
      const hashedPassword = await bcrypt.hash(config.password, config.hashRounds);
      //const verificationToken = crypto.randomBytes(32).toString("hex");
      const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
      const expirationTime = new Date(Date.now() + 5 * 60 * 1000);

      // Insert the new user into `unverified_users`
      await connection.query(
        "INSERT INTO unverified_users (username, email, password, verification_code, token_expires_at) VALUES (?, ?, ?, ?, ?)",
        [config.username, config.email, hashedPassword, verificationCode, expirationTime]
      );

      await connection.commit(); // Commit transaction if all queries succeed
      cb(verificationCode);
    } catch (error) {
      await connection.rollback(); // Rollback transaction on error
      console.error("Error registering user:", error);
      cb(null);
    } finally {
      connection.release(); // Release connection back to pool
    }
  }

  async update_user_by_username(username, newData) {
    // Filter out fields that shouldn't be updated
    const fields = Object.keys(newData)
      .filter(key => !['id', 'joined_date'].includes(key));

    if (fields.length === 0) return false;

    const setClause = fields.map(field => `${field} = ?`).join(', ');
    const values = fields.map(field => newData[field]);

    // Handle joined_date if it exists
    if (newData.joined_date) {
      newData.joined_date = new Date(newData.joined_date).toISOString().slice(0, 19).replace('T', ' ');
    }

    const query = `UPDATE users SET ${setClause} WHERE username = ?`;
    values.push(username);

    const [result] = await this.db.query(query, values);
    return result.affectedRows > 0;
  }

  async verify_user(config, cb) {
    const [rows] = await this.db.query(
      "SELECT * FROM unverified_users WHERE verification_code = ? AND token_expires_at > NOW()",
      [config.code]
    );

    let success = false;

    if (rows.length > 0) {
      const user = rows[0];
      await this.db.query("INSERT INTO users (username, email, password, display_name) VALUES (?, ?, ?, ?)", [
        user.username,
        user.email,
        user.password,
        user.username
      ]);

      await this.db.query("DELETE FROM unverified_users WHERE id = ?", [user.id]);

      success = true;
    }

    cb(success);
  }

  async resend_verification_email(config, cb) {
    const [rows] = await this.db.query("SELECT * FROM unverified_users WHERE email = ?", [config.email]);


    let success = false;

    if (rows.length > 0) {


      //const verificationToken = crypto.randomBytes(32).toString("hex");
      const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
      const expirationTime = new Date(Date.now() + 5 * 60 * 1000);


      await this.db.query(
        "UPDATE unverified_users SET verification_code = ?, token_expires_at = ? WHERE email = ?",
        [verificationCode, expirationTime, config.email]
      );

      success = true;

      cb(success, verificationCode);
    } else {
      cb(success, null);
    }


  }

  async create_recipe(config, cb) {
    function generateSlug(title) {
      return title.toLowerCase().replace(/\s+/g, "_");
    }

    const connection = await this.db.getConnection();
    await connection.beginTransaction();

    try {
      // Fetch the user ID from the username
      const [userResult] = await connection.query(
        "SELECT id FROM users WHERE username = ?",
        [config.authorUsername]
      );

      if (userResult.length === 0) {
        throw new Error('User not found');
      }

      const creatorId = userResult[0].id;

      // Check if the user already has a recipe with the same title
      const [existingRecipe] = await connection.query(
        "SELECT id FROM recipes WHERE title = ? AND creator = ?",
        [config.title, creatorId]
      );
      if (existingRecipe.length > 0) {
        throw new Error('User already has a recipe with this title');
      }

      // Insert the new recipe into the `recipes` table
      const [result] = await connection.query(
        "INSERT INTO recipes (title, slug, description, image_url, difficulty, prep_time, cook_time, servings, cal_count, creator, created_at, is_spinoff) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          config.title,
          generateSlug(config.title),
          config.description,
          config.imageUrl,
          config.difficulty,
          config.prepTime,
          config.cookTime,
          config.servings,
          config.calories,
          creatorId,  // Use the retrieved user ID here
          formatDateForMySQL(config.createdAt),
          config.isSpinoff || false
        ]
      );

      const recipeId = result.insertId;

      // Insert ingredients into the `recipe_ingredients` table
      if (config.ingredients && config.ingredients.length > 0) {
        for (let ingredient of config.ingredients) {
          // ingredient.unitType = ingredient.unitType || "N/A";
          // const [ingredientResult] = await connection.query(
          //   "SELECT id FROM ingredients WHERE name = ?",
          //   [ingredient.name]
          // );
          // const ingredientId = ingredientResult.length > 0 ? ingredientResult[0].id : null;

          // if (ingredientId) {
          // console.log("Testing ingredient: ", ingredient);
          await connection.query(
            "INSERT INTO recipe_ingredients (recipe_id, ingredient_name, quantity, unit_type) VALUES (?, ?, ?, ?)",
            [recipeId, ingredient.name, ingredient.quantity, ingredient.unit]
          );
          // }
        }
      }

      // Insert instructions into the `recipe_instructions` table
      if (config.instructions && config.instructions.length > 0) {
        for (let i = 0; i < config.instructions.length; i++) {
          await connection.query(
            "INSERT INTO recipe_instructions (recipe_id, instruction_number, instruction_text) VALUES (?, ?, ?)",
            [recipeId, config.instructions[i].id, config.instructions[i].text]
          );
        }
      }

      // Insert tags into the `recipe_tags` table
      if (config.tags && config.tags.length > 0) {
        for (let tag of config.tags) {
          const [tagResult] = await connection.query(
            "SELECT id FROM tags WHERE label = ?",
            [tag]
          );
          const tagId = tagResult.length > 0 ? tagResult[0].id : null;

          if (tagId) {
            await connection.query(
              "INSERT INTO recipe_tags (recipe_id, tag_id) VALUES (?, ?)",
              [recipeId, tagId]
            );
          }
        }
      }

      await connection.commit(); // Commit transaction if all queries succeed
      cb(null, recipeId);
    } catch (error) {
      await connection.rollback(); // Rollback transaction on error
      console.error("Error creating recipe:", error);
      cb(error, null);
    } finally {
      connection.release(); // Release connection back to pool
    }
  }

  async get_tags(id) {
    if (id) {
      const [rows] = await this.db.query(
        "SELECT label FROM tags ORDER BY label ASC WHERE id = ?",
        [id]
      );
      return rows.map(row => row.label);
    } else {
      const [rows] = await this.db.query(
        "SELECT label FROM tags ORDER BY label ASC"
      );
      return rows.map(row => row.label);
    }
  }

  async get_user_recipe(username, recipe_slug) {
    const [[user]] = await this.db.query(
      "SELECT id FROM users WHERE username = ?",
      [username]
    );
    const user_id = user.id;

    const query = `Select * from recipes WHERE creator = ? AND slug = ?`;

    const [recipes] = await this.db.query(query, [user_id, recipe_slug]);

    const enrichedRecipes = await Promise.all(recipes.map(async (recipe) => {
      const recipeId = recipe.id;

      const [ingredients] = await this.db.query(
        `SELECT id, ingredient_name, quantity, unit_type
         FROM recipe_ingredients
         WHERE recipe_id = ?`,
        [recipeId]
      );

      const [instructions] = await this.db.query(
        `SELECT id, instruction_number, instruction_text
         FROM recipe_instructions
         WHERE recipe_id = ?
         ORDER BY instruction_number`,
        [recipeId]
      );

      const [tags] = await this.db.query(
        `SELECT t.label
           FROM recipe_tags rt
           JOIN tags t ON rt.tag_id = t.id
           WHERE rt.recipe_id = ?`,
        [recipeId]
      );

      const [reviews] = await this.db.query(
        `SELECT * from recipe_reviews WHERE recipe_id = ?`,
        [recipeId]
      );


      return {
        ...recipe,
        ingredients,
        instructions,
        reviews,
        author_name: username,
        tags: tags.map(tag => tag.label),
      };
    }));

    return enrichedRecipes;
  }

  async get_recipes(config) {
    const { filter, fields } = config;

    const selectedFields = fields.map(f => `r.${f}`).join(', ');
    const baseSelect = `SELECT r.id, ${selectedFields}, u.username AS author FROM recipes r`;

    const joins = [`JOIN users u ON r.creator = u.id`];
    const conditions = [];
    const values = [];
    let havingClause = '';

    // Tags filter
    if (filter.tags && filter.tags.length > 0) {
      joins.push(`JOIN recipe_tags rt ON r.id = rt.recipe_id`);
      joins.push(`JOIN tags t ON rt.tag_id = t.id`);

      const tagPlaceholders = filter.tags.map(() => `?`).join(', ');
      conditions.push(`t.label IN (${tagPlaceholders})`);
      values.push(...filter.tags);

      // Add HAVING condition to require ALL tags
      havingClause = `HAVING COUNT(DISTINCT t.label) = ${filter.tags.length}`;
    }


    // Name filter
    if (filter.user) {
      conditions.push(`u.username = ?`);
      values.push(filter.user);
    }

    // Title filter
    if (filter.title) {
      conditions.push(`r.title LIKE ?`);
      values.push(`%${filter.title}%`);
    }

    // CookTime filter
    if (filter.cook_time) {
      conditions.push(`(r.prep_time + r.cook_time) <= ?`);
      values.push(filter.cook_time);
    }

    // Rating filter
    if (filter.average_rating) {
      conditions.push(`r.average_rating >= ?`);
      values.push(filter.average_rating);
    }

    // Rating filter
    if (filter.difficulty) {
      conditions.push(`r.difficulty = ?`);
      values.push(filter.difficulty);
    }

    let orderBy = '';

    if (config.sortType && config.sortType !== 'default') {
      switch (config.sortType) {
        case 'rating':
          orderBy = 'ORDER BY r.average_rating DESC';
          break;
        case 'time':
          orderBy = 'ORDER BY (r.prep_time + r.cook_time) ASC';
          break;
        case 'newest':
          orderBy = 'ORDER BY r.created_at DESC'; // make sure you have a created_at column
          break;
      }
    }

    let limitClause = '';
    if (config.limit) {
      limitClause = `LIMIT ${config.limit}`;
    }


    // Build main query
    const query = `
      ${baseSelect}
      ${joins.join('\n')}
      ${conditions.length > 0 ? 'WHERE ' + conditions.join(' AND ') : ''}
      GROUP BY r.id, u.username
      ${havingClause}
      ${orderBy}
      ${limitClause}
    `;

    // console.log("Query: ", query);
    // console.log(values);

    const [recipes] = await this.db.query(query, values);

    // Enrich each recipe with ingredients, instructions, tags, reviews
    const enrichedRecipes = await Promise.all(recipes.map(async (recipe) => {
      const recipeId = recipe.id;

      let ingredients = [];
      if (config.ingredients) {
        [ingredients] = await this.db.query(
          `SELECT ingredient_name, quantity, unit_type
           FROM recipe_ingredients
           WHERE recipe_id = ?`,
          [recipeId]
        );
      }

      let instructions = [];
      if (config.instructions) {
        [instructions] = await this.db.query(
          `SELECT instruction_number, instruction_text
           FROM recipe_instructions
           WHERE recipe_id = ?
           ORDER BY instruction_number`,
          [recipeId]
        );
      }

      let tags = [];
      if (config.tags) {
        [tags] = await this.db.query(
          `SELECT t.label
           FROM recipe_tags rt
           JOIN tags t ON rt.tag_id = t.id
           WHERE rt.recipe_id = ?`,
          [recipeId]
        );
      }

      let reviews = [];
      if (config.reviews) {
        [reviews] = await this.db.query(
          `SELECT * from recipe_reviews WHERE recipe_id = ?`,
          [recipeId]
        );
      }

      return {
        ...recipe,
        ingredients,
        instructions,
        reviews,
        tags: tags.map(tag => tag.label),
      };
    }));

    return enrichedRecipes;
  }


  refresh_unverified_users() {
    setInterval(async () => {
      try {
        const [result] = await this.db.query(
          "DELETE FROM unverified_users WHERE created_at < NOW() - INTERVAL 7 DAY"
        );
        console.log(`Deleted ${result.affectedRows} expired unverified users.`);
      } catch (error) {
        console.error("Error cleaning up unverified users:", error.message);
      }
    }, 24 * 60 * 60 * 1000);
  }
}
