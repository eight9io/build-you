import React, { useEffect, useState } from "react";
import { Controller } from "react-hook-form";
import { View } from "react-native";
import * as Location from "expo-location";
import { useTranslation } from "react-i18next";

import LocationSvg from "../assets/location.svg";
import ErrorText from "../../ErrorText";
import TextInput from "../TextInput";
import ConfirmDialog from "../../Dialog/ConfirmDialog/ConfirmDialog";
import SelectPicker from "../../Pickers/SelectPicker";
import { ISelectOption } from "../../../../types/common";
import { getNearbyLocations } from "../../../../service/location";
import CustomActivityIndicator from "../../CustomActivityIndicator";

interface ILocationInputProps {
  control?: any;
  setFormValue?: any;
  errors?: any;
  onLocationPicked?: (location: string) => void;
}

const LocationInput: React.FC<ILocationInputProps> = ({
  control,
  setFormValue,
  errors,
}) => {
  const { t } = useTranslation();
  const [requireLocationModalVisible, setRequireLocationModalVisible] =
    useState(false);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [selectedLocationIndex, setSelectedLocationIndex] = useState<
    number | undefined
  >();
  const [nearbyLocations, setNearbyLocations] = useState<ISelectOption[]>([]);
  const [nextPageToken, setNextPageToken] = useState<string | undefined>(); // for load more
  const [fetchLocationLoading, setFetchLocationLoading] =
    useState<boolean>(false);

  const handleTextInputPress = async () => {
    // Request permission to access location
    const permission = await Location.requestForegroundPermissionsAsync();
    if (permission.granted) {
      try {
        if (nearbyLocations.length === 0)
          // Avoid calling google map api multiple times
          await fetchNearbyLocations();
        setShowLocationPicker(true);
      } catch (error) {
        setShowLocationPicker(false);
      }
    } else setRequireLocationModalVisible(true); // Cases when user denied permission or the browser doesn't asking again even though the canAskAgain is true
  };

  const fetchNearbyLocations = async (isLoadMore?: boolean) => {
    setFetchLocationLoading(true);
    try {
      const { coords } = await Location.getCurrentPositionAsync();
      if (isLoadMore !== undefined && isLoadMore) {
        if (!nextPageToken) {
          setFetchLocationLoading(false);
          return;
        }
        const addresses = await getNearbyLocations(coords);
        if (addresses.length > 0) setNearbyLocations([...addresses]);
      } else {
        const addresses = await getNearbyLocations(coords);
        if (addresses.length > 0) setNearbyLocations(addresses);
      }
      setFetchLocationLoading(false);
    } catch (error) {
      setFetchLocationLoading(false);
      throw error;
    }
  };
  const handleCloseRequireLocationModal = () => {
    setRequireLocationModalVisible(false);
  };

  const handleLocationPicked = (index: number) => {
    if (index >= 0) {
      setSelectedLocationIndex(index);
      setFormValue("location", nearbyLocations[index].label);
    }
    setShowLocationPicker(false);
  };

  return (
    <View>
      {setFetchLocationLoading ? (
        <CustomActivityIndicator isVisible={fetchLocationLoading} />
      ) : null}
      <Controller
        control={control}
        rules={{
          required: true,
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            placeholder={t("new_progress_modal.enter_your_location") as string}
            label={t("new_progress_modal.location") as string}
            placeholderTextColor={"#C5C8D2"}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            onPress={handleTextInputPress}
            rightIcon={<LocationSvg />}
          />
        )}
        name="location"
      />
      {errors ? <ErrorText message={errors.message} /> : null}
      <SelectPicker
        title={t("new_progress_modal.enter_your_location") || ""}
        show={showLocationPicker}
        data={nearbyLocations}
        selectedIndex={selectedLocationIndex}
        onSelect={handleLocationPicked}
        onCancel={() => {
          setShowLocationPicker(false);
        }}
        onLoadMore={() => fetchNearbyLocations(true)}
        optionContainerClassName="px-4 py-3"
        optionTextClassName="text-[14px]"
        optionAutoHeight
      />
      <ConfirmDialog
        title={t("dialog.alert_title") || ""}
        description={t("new_progress_modal.enable_location_required") || ""}
        isVisible={requireLocationModalVisible}
        onClosed={handleCloseRequireLocationModal}
        closeButtonLabel={t("close") || ""}
      />
    </View>
  );
};

export default LocationInput;
