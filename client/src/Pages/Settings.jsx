import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { userData } from '../data/profileData';
import { Skeleton } from '@/components/ui/skeleton';
import { User, Mail, Bell, Shield, Upload, Camera, LogOut } from 'lucide-react';
import { Img } from '@/components/ui/Img';

function Settings({ user, setUser }) {
  const navigate = useNavigate();
  const [formData2, setformData2] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  // Initialize state for profile data
  const [loading, setLoading] = useState(true);

  // Fetch profile data when the component mounts
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/private-user-data/${user.username}`, {
          method: 'GET',
          credentials: 'include'
        });

        if (response.ok) {
          const data = await response.json();
          console.log(data.user.avatar_url);
          setformData2({
            bio: data.user.bio,
            comments_notification: data.user.comments_notification,
            display_name: data.user.display_name,
            email: data.user.email,
            followers_count: data.user.followers_count,
            following_count: data.user.following_count,
            new_followers_notification: data.user.new_followers_notification,
            newsletter_notification: data.user.newsletter_notification,
            public_profile_preference: data.user.public_profile_preference,
            recipe_count: data.user.recipe_count,
            show_email_preference: data.user.show_email_preference,
            total_likes: data.user.total_likes,
            username: data.user.username,
            avatar_url: data.user.avatar_url
          });
          setImagePreview(data.user.avatar_url);
        } else {
          console.error('Failed to fetch profile data');
        }
      } catch (error) {
        console.error('Error fetching profile data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [user.username]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setformData2(prev => ({ ...prev, [name]: value }));
  };

  const handleToggleChange = (name, checked) => {
    setformData2(prev => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    let uploadedImageUrl = null;

    // new image file to upload
    if (imageFile) {
      // Upload image
      const imageformData = new FormData();
      imageformData.append('image', imageFile);
      imageformData.append('previous_image_url', formData2.avatar_url);

      try {
        const res = await fetch('http://localhost:5000/upload-image', {
          method: 'POST',
          body: imageformData,
        });

        const data = await res.json();

        uploadedImageUrl = data.imageUrl;
      } catch (err) {
        setMessage('Error uploading image.');
        return;
      } finally {
        setImageFile(null);
        setformData2(prev => ({ ...prev, avatar_url: uploadedImageUrl }));
      }
    }

    try {
      const config = {
        bio: formData2.bio,
        comments_notification: formData2.comments_notification,
        display_name: formData2.display_name,
        email: formData2.email,
        followers_count: formData2.followers_count,
        following_count: formData2.following_count,
        new_followers_notification: formData2.new_followers_notification,
        newsletter_notification: formData2.newsletter_notification,
        public_profile_preference: formData2.public_profile_preference,
        recipe_count: formData2.recipe_count,
        show_email_preference: formData2.show_email_preference,
        total_likes: formData2.total_likes,
        username: formData2.username,
        avatar_url: uploadedImageUrl || formData2.avatar_url
      };

      console.log("Testing config: ", config);

      const response = await fetch(`http://localhost:5000/${user.username}/update-settings`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(config)
      });

      const result = await response.json();
      if (result.error) {
        alert('Error: ' + result.error);
      } else {
        setUser(result.user);
        setMessage('Settings updated.');
      }
    } catch (err) {
      console.error('Error saving user settings: ', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      setImageFile(file);
    } else {
      setMessage('Error accessing image.');
    }
  };


  if (loading) {
    // If the profile is still loading, show a loading skeleton
    return (
      <div className="recipe-container py-8">
        {/* Skeleton Loader */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start">
            <div className="relative w-24 h-24 rounded-full overflow-hidden mb-4 sm:mb-0 sm:mr-6 border-4 border-recipe-500">
              <Skeleton className="h-full w-full" />
            </div>
            <div className="flex-1 text-center sm:text-left">
              <Skeleton className="h-6 w-48 mb-2" />
              <Skeleton className="h-4 w-36 mb-2" />
              <Skeleton className="h-4 w-56 mb-4" />
              <div className="mt-4 flex justify-center sm:justify-start gap-4">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
          </div>
        </div>
        {/* Repeat for other skeletons */}
      </div>
    );
  }

  return (
    <div className="recipe-container py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Settings</h1>
        <Button variant="outline" onClick={() => navigate('/profile')}>
          Back to Profile
        </Button>
      </div>

      {message && (
        <div className="mb-6 p-4 bg-recipe-100 text-recipe-700 rounded-md">
          {message}
        </div>
      )}

      <Tabs defaultValue="account" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="account" className="flex gap-2 items-center">
            <User size={16} />
            Account
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex gap-2 items-center">
            <Bell size={16} />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="privacy" className="flex gap-2 items-center">
            <Shield size={16} />
            Privacy
          </TabsTrigger>
        </TabsList>

        <form onSubmit={handleSubmit}>
          <TabsContent value="account">
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-4">Profile Picture</h2>
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  {imagePreview ? (
                    <Img src={imagePreview} alt={formData2.username} className="w-12 h-12 object-cover rounded-full" />
                  ) : (

                    <User className="w-12 h-12 text-recipe-500" />
                  )}

                  <div className="space-y-4 flex-grow">
                    <div className="flex gap-3">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                        id="avatarUpload"
                      />
                      <label
                        htmlFor="avatarUpload"
                        className="cursor-pointer inline-flex items-center gap-2 rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
                      >
                        <Upload size={16} />
                        Upload Photo
                      </label>
                    </div>
                  </div>

                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    name="username"
                    value={formData2.username}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="display_name">Display Name</Label>
                  <Input
                    id="display_name"
                    name="display_name"
                    value={formData2.display_name}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData2.email}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="bio">Bio</Label>
                  <textarea
                    id="bio"
                    name="bio"
                    value={formData2.bio}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-recipe-200 focus:border-recipe-300"
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="notifications">
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-4">Email Notifications</h2>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="newsletter" className="text-base">Newsletter</Label>
                      <p className="text-sm text-gray-500">Receive monthly updates and recipe inspiration</p>
                    </div>
                    <Switch
                      id="newsletter"
                      checked={formData2.newsletter_notification}
                      onCheckedChange={(checked) => handleToggleChange('newsletter_notification', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="comments" className="text-base">Comments</Label>
                      <p className="text-sm text-gray-500">Get notified when someone comments on your recipe</p>
                    </div>
                    <Switch
                      id="comments"
                      checked={formData2.comments_notification}
                      onCheckedChange={(checked) => handleToggleChange('comments_notification', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="follows" className="text-base">New Followers</Label>
                      <p className="text-sm text-gray-500">Get notified when someone follows you</p>
                    </div>
                    <Switch
                      id="follows"
                      checked={formData2.new_followers_notification}
                      onCheckedChange={(checked) => handleToggleChange('new_followers_notification', checked)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="privacy">
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-4">Privacy Settings</h2>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="publicProfile" className="text-base">Public Profile</Label>
                      <p className="text-sm text-gray-500">Allow others to see your profile</p>
                    </div>
                    <Switch
                      id="publicProfile"
                      checked={formData2.public_profile_preference}
                      onCheckedChange={(checked) => handleToggleChange('public_profile_preference', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="showEmail" className="text-base">Show Email</Label>
                      <p className="text-sm text-gray-500">Display your email on your public profile</p>
                    </div>
                    <Switch
                      id="showEmail"
                      checked={formData2.show_email_preference}
                      onCheckedChange={(checked) => handleToggleChange('show_email_preference', checked)}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h2 className="text-xl font-semibold mb-4 text-red-600">Danger Zone</h2>
                <div className="space-y-4">
                  <Button type="button" onClick={() => { alert("Not implemented yet."); }} variant="outline" className="border-red-500 text-red-500 hover:bg-red-50">
                    Delete Account
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          <div className="mt-6 flex justify-end">
            <Button type="submit" disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </Tabs>
    </div>
  );
}

export default Settings;
