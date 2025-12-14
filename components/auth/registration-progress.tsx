'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  ChevronRight,
  Save,
  Eye
} from 'lucide-react';

interface RegistrationStep {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'error';
  required: boolean;
  estimatedTime: number; // in minutes
}

interface RegistrationProgressProps {
  steps: RegistrationStep[];
  currentStep: number;
  onStepClick: (stepIndex: number) => void;
  onSaveProgress: () => void;
  totalProgress: number;
  className?: string;
}

export function RegistrationProgress({
  steps,
  currentStep,
  onStepClick,
  onSaveProgress,
  totalProgress,
  className = ''
}: RegistrationProgressProps) {
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const handleSaveProgress = async () => {
    setSaving(true);
    try {
      await onSaveProgress();
      setLastSaved(new Date());
    } catch (error) {
      console.error('Failed to save progress:', error);
    } finally {
      setSaving(false);
    }
  };

  const getStepIcon = (step: RegistrationStep) => {
    switch (step.status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'in_progress':
        return <Clock className="w-5 h-5 text-blue-600" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStepColor = (step: RegistrationStep) => {
    switch (step.status) {
      case 'completed':
        return 'border-green-200 bg-green-50';
      case 'in_progress':
        return 'border-blue-200 bg-blue-50';
      case 'error':
        return 'border-red-200 bg-red-50';
      default:
        return 'border-gray-200 bg-white';
    }
  };

  const getStepTextColor = (step: RegistrationStep) => {
    switch (step.status) {
      case 'completed':
        return 'text-green-800';
      case 'in_progress':
        return 'text-blue-800';
      case 'error':
        return 'text-red-800';
      default:
        return 'text-gray-600';
    }
  };

  const getEstimatedTime = (steps: RegistrationStep[]) => {
    const remainingSteps = steps.slice(currentStep);
    const totalMinutes = remainingSteps.reduce((acc, step) => acc + step.estimatedTime, 0);
    
    if (totalMinutes < 60) {
      return `${totalMinutes} minutes`;
    } else {
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;
      return `${hours}h ${minutes}m`;
    }
  };

  const completedSteps = steps.filter(step => step.status === 'completed').length;
  const totalSteps = steps.length;

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Registration Progress</span>
            <Badge variant="outline" className="text-sm">
              {completedSteps} of {totalSteps} completed
            </Badge>
          </CardTitle>
          <CardDescription>
            Complete all required steps to finish your registration
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Overall Progress</span>
                <span>{Math.round(totalProgress)}%</span>
              </div>
              <Progress value={totalProgress} className="h-3" />
            </div>

            {/* Time Estimate */}
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>Estimated time remaining:</span>
              <span className="font-medium">{getEstimatedTime(steps)}</span>
            </div>

            {/* Save Progress Button */}
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={handleSaveProgress}
                disabled={saving}
                className="flex items-center gap-2"
              >
                {saving ? (
                  <Clock className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {saving ? 'Saving...' : 'Save Progress'}
              </Button>

              {lastSaved && (
                <span className="text-xs text-gray-500">
                  Last saved: {lastSaved.toLocaleTimeString()}
                </span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Step Details */}
      <Card>
        <CardHeader>
          <CardTitle>Registration Steps</CardTitle>
          <CardDescription>
            Click on any step to navigate to it
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md ${
                  getStepColor(step)
                } ${index === currentStep ? 'ring-2 ring-primary ring-offset-2' : ''}`}
                onClick={() => onStepClick(index)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getStepIcon(step)}
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className={`font-medium ${getStepTextColor(step)}`}>
                          {step.title}
                        </h4>
                        {step.required && (
                          <Badge variant="outline" className="text-xs text-red-600 border-red-300">
                            Required
                          </Badge>
                        )}
                        {index === currentStep && (
                          <Badge variant="default" className="text-xs">
                            Current
                          </Badge>
                        )}
                      </div>
                      <p className={`text-sm mt-1 ${getStepTextColor(step)}`}>
                        {step.description}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Estimated time: {step.estimatedTime} minutes
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${getStepColor(step).replace('bg-', 'text-').replace('50', '700')}`}
                    >
                      {step.status.replace('_', ' ')}
                    </Badge>
                    
                    {index === currentStep ? (
                      <Eye className="w-4 h-4 text-primary" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                </div>

                {/* Step Progress */}
                {step.status === 'in_progress' && (
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                      <span>Step Progress</span>
                      <span>In Progress</span>
                    </div>
                    <Progress value={75} className="h-2" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-green-50 border-green-200">
          <CardHeader>
            <CardTitle className="text-sm text-green-800">What's Next?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-green-700">
              Complete the current step to move forward. You can save your progress at any time and return later.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-sm text-blue-800">Need Help?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-blue-700">
              If you encounter any issues, our support team is here to help. Contact us for assistance.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 