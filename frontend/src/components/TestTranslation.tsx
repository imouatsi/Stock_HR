import React from 'react';
import { useTranslation } from '../hooks/useTranslation';

const TestTranslation: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <div>
      <h1>Translation Test</h1>
      <p>Translated text: {t('common.noData')}</p>
      <p>Direct translation: {t('contracts.title')}</p>
    </div>
  );
};

export default TestTranslation; 