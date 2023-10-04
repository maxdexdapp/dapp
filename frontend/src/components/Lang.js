import '../i18n';
import { useTranslation } from 'react-i18next'

export function Lang() {
  const { t } = useTranslation();
  return (
    <div className="App">
      <p>{t('hello')}</p>
	  <p>{t('world')}</p>
    </div>
  );
}

