import { PRIVACY_LEVEL_DESCRIPTIONS, PRIVACY_LEVELS, PrivacyLevel } from '@/app/api/utils';
import React from 'react';
interface PrivacyLevelDisplayProps {
    privacyLevel: PrivacyLevel;
}

export default function PrivacyLevelDisplay({
    privacyLevel
}: PrivacyLevelDisplayProps) {
return (
<div className="mb-4 p-4 bg-gray-50 border border-gray-200 rounded-lg mt-4">
<div className="flex items-center space-x-2">
  <div className={`w-3 h-3 rounded-full ${
    privacyLevel === PRIVACY_LEVELS.NO_PRIVACY ? 'bg-red-500' : 
    privacyLevel === PRIVACY_LEVELS.LOW_PRIVACY ? 'bg-orange-500' : 
    privacyLevel === PRIVACY_LEVELS.MEDIUM_PRIVACY ? 'bg-yellow-500' :
    privacyLevel === PRIVACY_LEVELS.HIGH_PRIVACY ? 'bg-green-500' : 'bg-gray-500'
  }`}></div>
    <div className="ml-2 flex flex-col"></div>
    <div className="flex items-center space-x-2">
      <span className="font-medium">Privacy Level:</span>
      <span className="capitalize">
        {
           privacyLevel === PRIVACY_LEVELS.NO_PRIVACY ? 'no privacy' : 
           privacyLevel === PRIVACY_LEVELS.LOW_PRIVACY ? 'low privacy' : 
           privacyLevel === PRIVACY_LEVELS.MEDIUM_PRIVACY ? 'medium privacy' :
           privacyLevel === PRIVACY_LEVELS.HIGH_PRIVACY ? 'high privacy' : 'unknown' 
        }
      </span>
    </div>
</div>
  <p className="text-sm text-gray-600 mt-1">
    {privacyLevel === PRIVACY_LEVELS.NO_PRIVACY ? PRIVACY_LEVEL_DESCRIPTIONS.NO_PRIVACY :
    privacyLevel === PRIVACY_LEVELS.LOW_PRIVACY ? PRIVACY_LEVEL_DESCRIPTIONS.LOW_PRIVACY :
    privacyLevel === PRIVACY_LEVELS.MEDIUM_PRIVACY ? PRIVACY_LEVEL_DESCRIPTIONS.MEDIUM_PRIVACY :
    privacyLevel === PRIVACY_LEVELS.HIGH_PRIVACY ? PRIVACY_LEVEL_DESCRIPTIONS.HIGH_PRIVACY :
    'Unknown privacy level'}
  </p>
</div>
)
}