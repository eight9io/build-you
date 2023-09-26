import { View, Text, Modal, ScrollView } from "react-native";
import React, { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import httpInstance from "../../../utils/http";

import { IHardSkill } from "../../../types/user";

import Header from "../../common/Header";
import clsx from "clsx";
import Close from "../../../component/asset/close.svg";
import Button from "../../common/Buttons/Button";

import AddSkillModal from "../AddSkill";

interface IAddSkillModallProps {
  setIsShowAddHardSkillModal: (value: boolean) => void;
  isVisible: boolean;
  onClose: () => void;
  setArrayMyHardSkills: (skills: any) => void;
  arrayMyHardSkills: IHardSkill[];
  setValue: any;
}

const NUMBER_OF_SKILL_REQUIRED = 3;
const MAX_NUMBER_OF_SKILL = 10;
export const AddHardSkills: FC<IAddSkillModallProps> = ({
  isVisible,
  onClose,
  setArrayMyHardSkills,
  arrayMyHardSkills,
  setValue,
}) => {
  const { t } = useTranslation();

  const [selectedCompetencedSkill, setSelectedCompetencedSkill] = useState<
    IHardSkill[]
  >([]);

  const [fetchedHardSkills, setFetchedHardSkills] = useState<IHardSkill[]>([]);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await httpInstance.get("/skill/hard/list");
        setFetchedHardSkills(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchSkills();
    setSelectedCompetencedSkill(arrayMyHardSkills);
  }, [arrayMyHardSkills]);

  const [isShowAddSkillModal, setIsShowAddSkillModal] =
    useState<boolean>(false);
  const [userAddSkill, setUserAddSkill] = useState<IHardSkill[]>([]);
  const [numberOfSkillError, setNumberOfSkillError] = useState<boolean>(false);
  const addCompetenceSkill = (skill: IHardSkill) => {
    if (
      selectedCompetencedSkill.length >= MAX_NUMBER_OF_SKILL &&
      !selectedCompetencedSkill.find((item) => item.id === skill.id)
    ) {
      setNumberOfSkillError(true);
      return;
    }
    if (!selectedCompetencedSkill.find((item) => item.id === skill.id)) {
      setSelectedCompetencedSkill((prev) => [...prev, skill]);
    } else {
      setSelectedCompetencedSkill((prev) =>
        prev.filter((item) => item.id !== skill.id)
      );
    }
  };
  const checkNumberOfSkills = () => {
    if (
      selectedCompetencedSkill.length < NUMBER_OF_SKILL_REQUIRED ||
      selectedCompetencedSkill.length > MAX_NUMBER_OF_SKILL
    ) {
      setNumberOfSkillError(true);
      return false;
    }
    setNumberOfSkillError(false);

    return (
      selectedCompetencedSkill.length >= NUMBER_OF_SKILL_REQUIRED ||
      selectedCompetencedSkill.length <= MAX_NUMBER_OF_SKILL
    );
  };

  useEffect(() => {
    if (userAddSkill.length > 0) {
      setFetchedHardSkills((prev) => [...prev, ...userAddSkill]);
      setUserAddSkill([]);
    }
  }, [userAddSkill]);

  const changeHardSkill = async () => {
    const isNumberOfSkills = await checkNumberOfSkills();

    if (isNumberOfSkills) {
      await setArrayMyHardSkills(selectedCompetencedSkill);
      await setValue("hardSkill", selectedCompetencedSkill);
      onClose();
    }
  };

  return (
    <Modal
      animationType="slide"
      presentationStyle="pageSheet"
      visible={isVisible}
    >
      <ScrollView showsVerticalScrollIndicator>
        <View className="relative mx-4 flex h-full flex-col rounded-t-xl bg-white">
          <Header
            title={t("add_hard_skill_modal.title") as string}
            leftBtn={<Close fill={"black"} />}
            rightBtn={t("add_hard_skill_modal.save_button").toLocaleUpperCase()}
            onRightBtnPress={changeHardSkill}
            onLeftBtnPress={onClose}
          />

          <View className=" px-4 py-6 ">
            <Text className="text-center text-h4 font-semibold leading-6 text-black-default">
              {t("add_hard_skill_modal.caption")}
            </Text>
            <Text className="mx-2 pt-2 text-center text-md font-normal leading-6 text-gray-dark">
              {t("add_hard_skill_modal.caption_placeholder")}
            </Text>
            {numberOfSkillError && (
              <Text className="pt-1 text-center text-sm font-normal leading-5 text-red-500">
                {t("add_hard_skill_modal.caption_required")}
              </Text>
            )}
            <View className="w-full flex-col justify-between py-4 ">
              <View className="w-full flex-row flex-wrap items-center justify-center">
                {fetchedHardSkills.map((item, index) => {
                  return (
                    <Button
                      key={index}
                      title={item.skill as any}
                      onPress={() => addCompetenceSkill(item)}
                      textClassName="line-[30px] text-center text-md text-gray-dark font-medium line-clamp-2"
                      containerClassName={clsx(
                        "border-gray-300 ml-1 border-[1px] mx-2 my-1.5 h-[55px] max-h-[85px] flex-none px-3 ",
                        {
                          "bg-primary-10": selectedCompetencedSkill.find(
                            (skill) => skill.id === item.id
                          ),
                          "border-primary-default":
                            selectedCompetencedSkill.find(
                              (skill) => skill.id === item.id
                            ),
                        }
                      )}
                    />
                  );
                })}
              </View>
              <Button
                containerClassName="flex-none px-1"
                textClassName="line-[30px] text-center text-md font-medium text-primary-default"
                title={t("modal_skill.manually")}
                onPress={() => setIsShowAddSkillModal(true)}
              />
            </View>
          </View>
        </View>
      </ScrollView>
      <AddSkillModal
        setUserAddSkill={setUserAddSkill}
        isVisible={isShowAddSkillModal}
        onClose={() => setIsShowAddSkillModal(false)}
      />
    </Modal>
  );
};
export default AddHardSkills;
