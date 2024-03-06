import React, { useState } from "react";
import clsx from "clsx";
import { Controller } from "react-hook-form";
import { View, Text, Linking } from "react-native";
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
    const currentPermission = await Location.getForegroundPermissionsAsync();
    if (currentPermission && currentPermission.granted) {
      await fetchNearbyLocations();
      setShowLocationPicker(true);
    } else {
      // Request permission to access location
      const permission = await Location.requestForegroundPermissionsAsync();
      if (permission.granted) {
        await fetchNearbyLocations();
        setShowLocationPicker(true);
      } else if (!permission.canAskAgain) {
        // Case: user denied permission => show dialog to open settings to enable location
        setRequireLocationModalVisible(true);
      }
    }
  };

  const fetchNearbyLocations = async (isLoadMore?: boolean) => {
    setFetchLocationLoading(true);
    const { coords } = await Location.getCurrentPositionAsync();
    const extractedCoords = `${coords.latitude},${coords.longitude}`;
    if (isLoadMore !== undefined && isLoadMore) {
      if (!nextPageToken) {
        setFetchLocationLoading(false);
        return;
      }
      const addresses = await getNearbyLocations(extractedCoords);
      if (addresses.length > 0) setNearbyLocations([...addresses]);
    } else {
      const addresses = await getNearbyLocations(extractedCoords);
      if (addresses.length > 0) setNearbyLocations(addresses);
    }
    setFetchLocationLoading(false);
  };
  const handleCloseRequireLocationModal = () => {
    setRequireLocationModalVisible(false);
  };
  const handleConfirmRequireLocationModal = () => {
    setRequireLocationModalVisible(false);
    Linking.openSettings();
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
      />
      <ConfirmDialog
        title={t("dialog.alert_title") || ""}
        description={t("new_progress_modal.enable_location_required") || ""}
        isVisible={requireLocationModalVisible}
        onClosed={handleCloseRequireLocationModal}
        closeButtonLabel={t("close") || ""}
        confirmButtonLabel={t("dialog.open_settings") || ""}
        onConfirm={handleConfirmRequireLocationModal}
      />
    </View>
  );
};

export default LocationInput;
