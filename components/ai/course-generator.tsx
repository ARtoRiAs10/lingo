"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Sparkles, BookOpen } from 'lucide-react';
import { toast } from 'sonner';

type Props = {
  onCourseGenerated?: (courseId: string) => void;
};

export const CourseGenerator = ({ onCourseGenerated }: Props) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState({
    topic: '',
    language: '',
    difficulty: '',
    makePublic: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);

    try {
      const response = await fetch('/api/ai/generate-course', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(`Course "${data.title}" generated successfully!`);
        onCourseGenerated?.(data.courseId);
        setFormData({ topic: '', language: '', difficulty: '', makePublic: false });
      } else {
        toast.error(data.error || 'Failed to generate course');
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
      console.error('Generation error:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          <Sparkles className="h-6 w-6 text-yellow-500" />
          AI Course Generator
          <BookOpen className="h-6 w-6 text-blue-500" />
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Create a personalized language course powered by AI
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Course Topic</label>
            <Input
              placeholder="e.g., Travel phrases, Business conversation..."
              value={formData.topic}
              onChange={(e: { target: { value: any; }; }) => setFormData({ ...formData, topic: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium">Target Language</label>
            <Select onValueChange={(value: any) => setFormData({ ...formData, language: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="spanish">Spanish</SelectItem>
                <SelectItem value="french">French</SelectItem>
                <SelectItem value="german">German</SelectItem>
                <SelectItem value="italian">Italian</SelectItem>
                <SelectItem value="portuguese">Portuguese</SelectItem>
                <SelectItem value="japanese">Japanese</SelectItem>
                <SelectItem value="korean">Korean</SelectItem>
                <SelectItem value="chinese">Chinese</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium">Difficulty Level</label>
            <Select onValueChange={(value: any) => setFormData({ ...formData, difficulty: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="makePublic"
              checked={formData.makePublic}
              onChange={(e) => setFormData({ ...formData, makePublic: e.target.checked })}
            />
            <label htmlFor="makePublic" className="text-sm">
              Make this course public for others to use
            </label>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isGenerating || !formData.topic || !formData.language || !formData.difficulty}
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Course...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Course
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
