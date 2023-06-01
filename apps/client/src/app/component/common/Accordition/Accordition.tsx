import React from 'react';
import { View, Text } from 'react-native';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

import AccorditionItem from './AccorditionItem';

const Accordition = () => {
  const { t } = useTranslation();

  return (
    <View>
      <View className={clsx('flex flex-col pt-7')}>
        <View className={clsx('py-4')}>
          <Text className={clsx('text-h4 font-medium')}>
            {t('user_settings_screen.general_settings')}
          </Text>
        </View>
        <View>
          <Text className={clsx('text-h6 font-normal leading-6')}>
            {t('user_settings_screen.general_settings_description')}
          </Text>
        </View>
        <AccorditionItem
          title={t(
            'user_settings_screen.general_settings_sections.cookie_regulation'
          )}
        />
        <AccorditionItem
          title={t(
            'user_settings_screen.general_settings_sections.preferences'
          )}
        />
        <AccorditionItem
          title={t(
            'user_settings_screen.general_settings_sections.community_standards'
          )}
        />
        <AccorditionItem
          title={t(
            'user_settings_screen.general_settings_sections.notifications'
          )}
        />
      </View>
      <View className={clsx('flex flex-col pt-7')}>
        <View className={clsx('py-4')}>
          <Text className={clsx('text-h4 font-medium')}>
            {t('user_settings_screen.account')}
          </Text>
        </View>
        <View>
          <Text className={clsx('text-h6 font-normal leading-6')}>
          {t('user_settings_screen.account_settings_description')}
          </Text>
        </View>
        <AccorditionItem title={t('user_settings_screen.account_settings_sections.personal_information')} />
        <AccorditionItem title={t('user_settings_screen.account_settings_sections.security_and_access')} />
        <AccorditionItem title={t('user_settings_screen.account_settings_sections.condition_of_use')} />
      </View>
    </View>
  );
};

export default Accordition;
