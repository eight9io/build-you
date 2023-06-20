import { View, Text, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import clsx from 'clsx'
import IconEyeOff from './asset/eye-off.svg';

import IconEyeOn from './asset/icon-eye.svg';
import { Controller, useForm } from 'react-hook-form'
import TextInput from '../../component/common/Inputs/TextInput'
import ErrorText from '../../component/common/ErrorText';
import { yupResolver } from '@hookform/resolvers/yup';
import { LoginValidationSchema } from '../../Validators/Login.validate';
import { useUserProfileStore } from '../../store/user-data';
import Button from '../../component/common/Buttons/Button';

export default function DeleteAccountScreen({ navigation }: any) {
    const [hidePassword, setHidePassword] = useState(true);
    const { t } = useTranslation()
    const { getUserProfile } = useUserProfileStore()
    const userData = getUserProfile()
    const {
        control,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm({
        defaultValues: {
            user: userData?.email || '',
            password: '',
        },
        resolver: yupResolver(LoginValidationSchema()),
        reValidateMode: 'onChange',
        mode: 'onSubmit',
    });
    return (
        <SafeAreaView className="justify-content: space-between flex-1 bg-white pt-3 px-4">
            <ScrollView>
                <View className={clsx('py-4')}>
                    <Text className={clsx('text-h6 font-medium')}>
                        {t('delete_account.title_sub')}
                    </Text>
                    <Text className={clsx('text-h6 pt-4  leading-5 text-[#34363F] font-normal')}>
                        {t('delete_account.description')}
                    </Text>
                </View>
                <View className=" py-4">
                    {userData && <View className=" px-1" >
                        <Controller
                            control={control}
                            name="password"
                            rules={{
                                required: true,
                            }}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <View className="flex flex-col gap-1">
                                    <TextInput
                                        rightIcon={
                                            !hidePassword ? (
                                                <TouchableOpacity
                                                    onPress={() =>
                                                        setHidePassword(!hidePassword)
                                                    }
                                                    className=" mt-[2px]"
                                                >
                                                    <IconEyeOn />
                                                </TouchableOpacity>
                                            ) : (
                                                <TouchableOpacity
                                                    onPress={() =>
                                                        setHidePassword(!hidePassword)
                                                    }
                                                    className=" mt-[2px]"
                                                >
                                                    <IconEyeOff />
                                                </TouchableOpacity>
                                            )}
                                        secureTextEntry={
                                            hidePassword
                                                ? true
                                                : false
                                        }
                                        label="Password"
                                        placeholder="Password"
                                        placeholderTextColor={'rgba(0, 0, 0, 0.5)'}
                                        onBlur={onBlur}
                                        onChangeText={(text) => onChange(text)}
                                        value={value}
                                    />
                                </View>
                            )}
                        />
                        {errors.password && (
                            <ErrorText
                                message={
                                    errors.password?.message
                                }
                            />
                        )}
                        <View className=" pt-8">
                            <Button
                                title={t('dialog.delete')}
                                containerClassName="border-[1px] flex-1 border-slate-300 "
                                textClassName="text-black text-md leading-6"
                            // onPress={() => handleLogout()}
                            />
                        </View>
                    </View>}
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}