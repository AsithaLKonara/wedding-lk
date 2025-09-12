'use client';

import { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  X, 
  Image, 
  Video, 
  MapPin, 
  Tag, 
  Send, 
  Upload,
  Trash2,
  Edit3
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PostCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPostCreated: (post: any) => void;
  authorType: 'user' | 'vendor' | 'venue' | 'planner';
  authorId: string;
}

interface MediaFile {
  file: File;
  preview: string;
  type: 'image' | 'video';
}

export function PostCreationModal({ 
  isOpen, 
  onClose, 
  onPostCreated, 
  authorType, 
  authorId 
}: PostCreationModalProps) {
  const [content, setContent] = useState('');
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [location, setLocation] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    files.forEach(file => {
      if (mediaFiles.length >= 10) {
        toast({
          title: "Maximum files reached",
          description: "You can upload up to 10 files per post",
          variant: "destructive"
        });
        return;
      }

      const isImage = file.type.startsWith('image/');
      const isVideo = file.type.startsWith('video/');
      
      if (!isImage && !isVideo) {
        toast({
          title: "Invalid file type",
          description: "Please select images or videos only",
          variant: "destructive"
        });
        return;
      }

      if (file.size > 50 * 1024 * 1024) { // 50MB limit
        toast({
          title: "File too large",
          description: "Please select files smaller than 50MB",
          variant: "destructive"
        });
        return;
      }

      const preview = URL.createObjectURL(file);
      setMediaFiles(prev => [...prev, {
        file,
        preview,
        type: isImage ? 'image' : 'video'
      }]);
    });
  };

  const removeMediaFile = (index: number) => {
    setMediaFiles(prev => {
      const newFiles = [...prev];
      URL.revokeObjectURL(newFiles[index].preview);
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags(prev => [...prev, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(prev => prev.filter(tag => tag !== tagToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      addTag();
    }
  };

  const uploadMedia = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', 'post');
    formData.append('entityId', authorId);
    formData.append('folder', 'posts');

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    const data = await response.json();
    return data.data.url;
  };

  const handleSubmit = async () => {
    if (!content.trim() && mediaFiles.length === 0) {
      toast({
        title: "Content required",
        description: "Please add some content or media to your post",
        variant: "destructive"
      });
      return;
    }

    setIsPosting(true);

    try {
      // Upload media files
      const uploadedImages: string[] = [];
      
      for (const mediaFile of mediaFiles) {
        const url = await uploadMedia(mediaFile.file);
        uploadedImages.push(url);
      }

      // Create post
      const postData = {
        content: content.trim(),
        images: uploadedImages,
        tags,
        authorType,
        authorId,
        location: location.trim() || undefined,
      };

      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });

      if (!response.ok) {
        throw new Error('Failed to create post');
      }

      const data = await response.json();
      
      toast({
        title: "Post created!",
        description: "Your post has been shared successfully",
      });

      onPostCreated(data.data);
      handleClose();

    } catch (error) {
      console.error('Error creating post:', error);
      toast({
        title: "Error",
        description: "Failed to create post. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsPosting(false);
    }
  };

  const handleClose = () => {
    // Clean up object URLs
    mediaFiles.forEach(media => URL.revokeObjectURL(media.preview));
    
    // Reset form
    setContent('');
    setMediaFiles([]);
    setTags([]);
    setTagInput('');
    setLocation('');
    
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit3 className="h-5 w-5" />
            Create New Post
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Content Input */}
          <div className="space-y-2">
            <Label htmlFor="content">What's on your mind?</Label>
            <Textarea
              id="content"
              placeholder="Share your wedding inspiration, tips, or experiences..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[120px] resize-none"
              maxLength={2000}
            />
            <div className="text-right text-sm text-gray-500">
              {content.length}/2000
            </div>
          </div>

          {/* Media Upload */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Media (Images & Videos)</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={mediaFiles.length >= 10}
              >
                <Upload className="h-4 w-4 mr-2" />
                Add Media
              </Button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,video/*"
              onChange={handleFileSelect}
              className="hidden"
            />

            {mediaFiles.length > 0 && (
              <div className="grid grid-cols-2 gap-4">
                {mediaFiles.map((media, index) => (
                  <Card key={index} className="relative group">
                    <CardContent className="p-2">
                      {media.type === 'image' ? (
                        <img
                          src={media.preview}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-32 object-cover rounded"
                        />
                      ) : (
                        <video
                          src={media.preview}
                          className="w-full h-32 object-cover rounded"
                          controls
                        />
                      )}
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeMediaFile(index)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <div className="flex gap-2">
              <Input
                id="tags"
                placeholder="Add tags (press Enter)"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <Button type="button" onClick={addTag} disabled={!tagInput.trim()}>
                Add
              </Button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="cursor-pointer">
                    #{tag}
                    <X 
                      className="h-3 w-3 ml-1 cursor-pointer" 
                      onClick={() => removeTag(tag)}
                    />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location">Location (Optional)</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="location"
                placeholder="Where was this taken?"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={isPosting || (!content.trim() && mediaFiles.length === 0)}
            >
              {isPosting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Posting...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Post
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}


