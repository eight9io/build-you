import clsx from "clsx";
import { useTranslation } from "react-i18next";
import { FC, useEffect, useRef, useState } from "react";
import { FlatList } from "react-native-gesture-handler";
import {
  View,
  Text,
  ActivityIndicator,
  Animated,
  Easing,
  Platform,
} from "react-native";

import { ICompanyData, ICompanyDataUser } from "../../../../types/company";

import Button from "../../Buttons/Button";
import BottomSheet from "../../BottomSheet/BottomSheet";
import BottomSheetOption from "../../Buttons/BottomSheetOption";
import CompanySearchBar from "../../SearchBar/CompanySearchBar";
import { useDebounce } from "../../../../hooks/useDebounce";
import { getCompaniesByName } from "../../../../service/search";
import { AxiosResponse } from "axios";
import { serviceGetAllCompany } from "../../../../service/company";

interface ISelectPickerProps {
  show: boolean;
  title?: string;
  selectedIndex?: number;
  onSelect: (value: ICompanyDataUser) => void;
  onCancel: () => void;
  onLoadMore?: () => void;
}

const SelectPickerCompany: FC<ISelectPickerProps> = ({
  show,
  title,
  selectedIndex,
  onSelect,
  onCancel,
  onLoadMore,
}) => {
  const { t } = useTranslation();
  const [selected, setSelected] = useState<number>(0);
  const [isSearchBarFocused, setIsSearchBarFocused] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>("");
  const [companyList, setCompanyList] = useState<ICompanyDataUser[]>([]);
  const [searchedCompanies, setSearchedCompanies] = useState<
    ICompanyDataUser[]
  >([]);
  const [isSearchLoading, setIsSearchLoading] = useState<boolean>(false);
  const debouncedSearchQuery = useDebounce(searchText, 500); // Adjust the delay as needed
  // Initialize animated value for search bar focus animation
  const animatedHeight = useRef(new Animated.Value(30)).current;
  const bottomSheetRef = useRef(null);

  useEffect(() => {
    const getCompanyList = async () => {
      try {
        const res = await serviceGetAllCompany();
        const companyUserList = res.data.map((item: ICompanyData) => {
          return {
            ...item.user,
          };
        });
        setCompanyList(companyUserList);
      } catch (error) {
        console.error("Error get company list", error);
      }
    };
    getCompanyList();
  }, []);

  useEffect(() => {
    Animated.timing(animatedHeight, {
      toValue: isSearchBarFocused ? (Platform.OS === "android" ? 15 : 20) : 30,
      duration: 150, // Adjust the duration as needed
      easing: Easing.linear,
      useNativeDriver: false, // Set to false if you are using older versions of React Native
    }).start();
  }, [isSearchBarFocused]);

  useEffect(() => {
    if (debouncedSearchQuery) {
      setIsSearchLoading(true);
      getCompaniesByName(debouncedSearchQuery)
        .then((response: AxiosResponse) => {
          setIsSearchLoading(false);
          setSearchedCompanies(response.data);
        })
        .catch((error) => {
          setIsSearchLoading(false);
          setSearchedCompanies([]);
          console.error("error", error);
        });
    } else {
      setSearchedCompanies([]);
    }
  }, [debouncedSearchQuery]);

  const hanldeSelectCompany = (index: number) => {
    setSearchText("");
    if (debouncedSearchQuery) {
      const selectedCompany = searchedCompanies[index];
      return onSelect(selectedCompany);
    }
    setSelected(index);
    onSelect(companyList[index]);
  };

  const handleClose = () => {
    onCancel();
    setSearchText("");
  };

  useEffect(() => {
    setSelected(selectedIndex || 0);
  }, [selectedIndex]);

  useEffect(() => {
    if (show) {
      bottomSheetRef.current?.open();
    } else {
      bottomSheetRef.current?.close();
    }
  }, [show]);

  return (
    <View>
      <BottomSheet
        ref={bottomSheetRef}
        onClose={handleClose}
        HeaderComponent={
          <>
            <View className="mt-3 flex w-full flex-row items-center justify-center pb-3">
              <Text className="text-base font-semibold">{title}</Text>
            </View>
            <View className="mb-4 flex w-full flex-row items-center justify-center">
              <CompanySearchBar
                focused={isSearchBarFocused}
                setFocused={setIsSearchBarFocused}
                searchPhrase={searchText}
                setSearchPhrase={setSearchText}
              />
            </View>
          </>
        }
        FloatingComponent={
          <View className="h-14 w-full bg-white px-4">
            <Button
              title={t("save") || "Save"}
              onPress={() => hanldeSelectCompany(selected)}
              containerClassName="bg-primary-default flex-1 mb-2"
              textClassName="text-white"
              disabledContainerClassName="bg-gray-light flex-none px-1"
              disabledTextClassName="line-[30px] text-center text-md font-medium text-gray-medium ml-2"
              isDisabled={
                (debouncedSearchQuery && searchedCompanies.length === 0) ||
                companyList.length === 0
              }
            />
          </View>
        }
        modalHeight={500}
      >
        <View className="h-full">
          {isSearchLoading ? (
            <View className="flex flex-1 items-center justify-center">
              <ActivityIndicator size="large" />
            </View>
          ) : (
            <>
              {(debouncedSearchQuery && searchedCompanies.length === 0) ||
              companyList.length === 0 ? (
                <View className="flex flex-1 items-center  pt-6">
                  <Text className="text-lg font-semibold text-gray-600">
                    {t("search_company.no_result")}
                  </Text>
                </View>
              ) : (
                <FlatList
                  data={debouncedSearchQuery ? searchedCompanies : companyList}
                  keyExtractor={(_, index) => `${Math.random()}-${index}}`}
                  renderItem={({ item, index }) => {
                    return (
                      <View className="px-4">
                        <BottomSheetOption
                          onPress={() => setSelected(index)}
                          title={item?.name}
                          containerClassName={clsx(
                            "focus:bg-gray-light",
                            index === selected && "bg-gray-light"
                          )}
                          textClassName={clsx(
                            "text-base font-normal",
                            index === selected && "font-semibold"
                          )}
                        />
                      </View>
                    );
                  }}
                  onEndReached={onLoadMore}
                  ListFooterComponent={<View className="h-10" />}
                  onEndReachedThreshold={0.5}
                  className="mb-8 flex-1"
                />
              )}
            </>
          )}
        </View>
      </BottomSheet>
    </View>
  );
};

export default SelectPickerCompany;
