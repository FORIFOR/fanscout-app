import React, { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage,
  FormDescription
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useClubs } from '@/hooks/useClubs';
import { useCreateReport } from '@/hooks/useReports';
import { useToast } from '@/hooks/use-toast';
import { Match } from '@/types';
import { Camera, Upload, X } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { Card, CardContent } from '@/components/ui/card';

interface ScoutingFormProps {
  match: Match;
  onSubmitSuccess: () => void;
  onCancel: () => void;
}

const positionOptions = ['Goalkeeper', 'Defender', 'Midfielder', 'Striker'];
const recommendationOptions = ['Highly Recommend', 'Recommend', 'Consider', 'Not Recommended'];
const ratingOptions = [1, 2, 3, 4, 5];

const skillCategories = [
  { name: 'technicalAbility', label: 'Technical Ability' },
  { name: 'physicalAttributes', label: 'Physical Attributes' },
  { name: 'tacticalUnderstanding', label: 'Tactical Understanding' },
  { name: 'mentalAttributes', label: 'Mental Attributes' },
  { name: 'potential', label: 'Potential' }
];

const formSchema = z.object({
  clubId: z.string().min(1, { message: 'Please select a club' }),
  playerName: z.string().min(2, { message: 'Please enter player name' }),
  playerAge: z.string().min(1, { message: 'Please enter player age' }),
  playerPosition: z.string().min(1, { message: 'Please select a position' }),
  overallRating: z.number().min(1).max(5),
  technicalAbility: z.number().min(1).max(5),
  physicalAttributes: z.number().min(1).max(5),
  tacticalUnderstanding: z.number().min(1).max(5),
  mentalAttributes: z.number().min(1).max(5),
  potential: z.number().min(1).max(5),
  observations: z.string().min(10, { message: 'Please provide detailed observations' }),
  recommendation: z.string().min(1, { message: 'Please select a recommendation' }),
});

type FormData = z.infer<typeof formSchema>;

export default function ScoutingForm({ match, onSubmitSuccess, onCancel }: ScoutingFormProps) {
  const { clubs } = useClubs();
  const createReport = useCreateReport();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      clubId: '',
      playerName: '',
      playerAge: '',
      playerPosition: '',
      overallRating: 3,
      technicalAbility: 3,
      physicalAttributes: 3,
      tacticalUnderstanding: 3,
      mentalAttributes: 3,
      potential: 3,
      observations: '',
      recommendation: '',
    },
  });
  
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setPhotoFile(file);
      
      // Create a preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const removePhoto = () => {
    setPhotoFile(null);
    setPhotoPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const onSubmit = async (data: FormData) => {
    try {
      // Extract clubs that are scouting this match
      const scoutingClubIds = typeof match.scoutingClubs === 'object' 
        ? match.scoutingClubs.map((club: any) => club.id) 
        : match.scoutingClubs;
      
      // Validate that the selected club is scouting this match
      if (!scoutingClubIds.includes(parseInt(data.clubId))) {
        toast({
          title: 'Invalid selection',
          description: 'The selected club is not scouting this match',
          variant: 'destructive',
        });
        return;
      }
      
      const createdReport = await createReport.mutateAsync({
        ...data,
        clubId: parseInt(data.clubId),
        playerAge: parseInt(data.playerAge),
        matchId: match.id,
        userId: 1, // Using a default user ID for now
      });
      
      // If a photo was selected, upload it for the new report
      if (photoFile && createdReport) {
        setIsUploading(true);
        try {
          const formData = new FormData();
          formData.append('photo', photoFile);
          
          await apiRequest(`/api/scouting-reports/${createdReport.id}/photo`, {
            method: 'POST',
            body: formData,
            // Don't set Content-Type header - the browser will set it with the boundary for multipart/form-data
          });
          
          toast({
            title: 'Photo uploaded',
            description: 'The player photo has been attached to your report.',
          });
        } catch (uploadError) {
          console.error('Error uploading photo:', uploadError);
          toast({
            title: 'Photo upload failed',
            description: 'Your report was saved, but the photo could not be uploaded.',
            variant: 'destructive',
          });
        } finally {
          setIsUploading(false);
        }
      }
      
      toast({
        title: 'Report submitted',
        description: 'Your scouting report has been submitted successfully!',
      });
      
      onSubmitSuccess();
    } catch (error) {
      console.error('Error submitting report:', error);
      toast({
        title: 'Submission failed',
        description: 'There was an error submitting your report. Please try again.',
        variant: 'destructive',
      });
    }
  };
  
  return (
    <div className="border-t border-gray-200 pt-6 mt-6">
      <h4 className="font-medium text-lg mb-4">Create Scouting Report</h4>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="clubId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Club to Scout For</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a club" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Array.isArray(match.scoutingClubs) && match.scoutingClubs.map((club: any) => (
                        <SelectItem key={club.id} value={club.id.toString()}>
                          {club.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="playerName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Player Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter player name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="playerPosition"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Position</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select position" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {positionOptions.map(position => (
                        <SelectItem key={position} value={position}>
                          {position}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="playerAge"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Age</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="Player's age" 
                      min="15" 
                      max="45"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="overallRating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Overall Rating</FormLabel>
                  <Select 
                    onValueChange={(value) => field.onChange(parseInt(value))} 
                    defaultValue={field.value.toString()}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select rating" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {ratingOptions.map(rating => (
                        <SelectItem key={rating} value={rating.toString()}>
                          {rating} - {rating === 5 ? 'Exceptional' : 
                                     rating === 4 ? 'Very Good' :
                                     rating === 3 ? 'Good' :
                                     rating === 2 ? 'Average' : 'Poor'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h5 className="font-medium mb-3">Skill Ratings</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {skillCategories.map((category) => (
                <FormField
                  key={category.name}
                  control={form.control}
                  name={category.name as any}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{category.label}</FormLabel>
                      <div className="flex items-center">
                        <div className="flex-1 mr-4">
                          <FormControl>
                            <Slider
                              min={1}
                              max={5}
                              step={1}
                              value={[field.value]}
                              onValueChange={(value) => field.onChange(value[0])}
                            />
                          </FormControl>
                        </div>
                        <span className="text-sm font-medium w-8 text-center">{field.value}/5</span>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
            </div>
          </div>
          
          <FormField
            control={form.control}
            name="observations"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Detailed Observations</FormLabel>
                <FormControl>
                  <Textarea 
                    rows={4}
                    placeholder="Describe the player's performance, strengths, weaknesses, and potential..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="recommendation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Recommendation</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select recommendation" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {recommendationOptions.map(option => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Photo Upload Section */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h5 className="font-medium mb-3">Player Photo</h5>
            <div className="space-y-4">
              <FormItem>
                <FormLabel>Upload Player Photo (Optional)</FormLabel>
                <FormDescription>
                  Add a photo of the player to help with identification.
                </FormDescription>
                
                {photoPreview ? (
                  <Card className="relative overflow-hidden mt-2">
                    <CardContent className="p-0">
                      <div className="relative aspect-video w-full overflow-hidden">
                        <img src={photoPreview} alt="Player preview" className="object-cover w-full h-full" />
                        <Button 
                          type="button"
                          variant="destructive"
                          size="icon"
                          onClick={removePhoto}
                          className="absolute top-2 right-2 rounded-full w-8 h-8"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="mt-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      id="player-photo"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full h-24 flex flex-col items-center justify-center gap-2 border-dashed"
                    >
                      <Camera className="h-6 w-6" />
                      <span>Click to add a player photo</span>
                    </Button>
                  </div>
                )}
              </FormItem>
            </div>
          </div>
          
          <div className="flex justify-end space-x-3">
            <Button 
              type="button" 
              variant="outline"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={createReport.isPending}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
            >
              {createReport.isPending ? 'Submitting...' : 'Submit Report'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
