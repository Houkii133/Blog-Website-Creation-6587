import React from 'react';
import { HelpHub } from '@questlabs/react-sdk';
import questConfig from '../config/questConfig';

const AppHelp = () => {
  // Get or generate user ID
  const getUserId = () => {
    let userId = localStorage.getItem('userId');
    if (!userId) {
      userId = questConfig.USER_ID;
      localStorage.setItem('userId', userId);
    }
    return userId;
  };

  return (
    <div style={{ zIndex: 10000 }}>
      <HelpHub
        uniqueUserId={getUserId()}
        questId={questConfig.QUEST_HELP_QUESTID}
        accent={questConfig.PRIMARY_COLOR}
        botLogo={{
          logo: 'https://quest-media-storage-bucket.s3.us-east-2.amazonaws.com/1741000949338-Vector%20%282%29.png'
        }}
        styleConfig={{
          primaryColor: questConfig.PRIMARY_COLOR,
          fontFamily: 'Inter, system-ui, sans-serif',
          borderRadius: '8px'
        }}
      />
    </div>
  );
};

export default AppHelp;