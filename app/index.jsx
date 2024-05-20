import {
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useState } from "react";
import { debounce } from "lodash";
import { getLocation, getWeather } from "../api/weather";
import { weatherIcons } from "../constants";
import * as Progress from "react-native-progress";

export default function Page() {
  const [showSearch, toogleSearch] = useState(false);
  const [locations, setLocation] = useState([]);
  const [weatherData, setWeatherData] = useState({});
  const [loading, setLoading] = useState(true);

  const handleLocation = (loc) => {
    setLocation([]);
    toogleSearch(false);
    setLoading(true);
    getWeather({ city: loc.name, days: 7 }).then((data) => {
      setLoading(false);
      setWeatherData(data);
      console.log(data);
    });
  };

  const handleSearch = (value) => {
    // fetchlocation
    getLocation({ city: value }).then((data) => {
      setLocation(data);
    });
  };

  useEffect(() => {
    getInitialWeather();
  }, []);

  const getInitialWeather = () => {
    getWeather({ city: "Dhaka", days: "7" }).then((data) => {
      setWeatherData(data);
      setLoading(false);
    });
  };

  const handeTextDebounce = useCallback(debounce(handleSearch, 1200), []);

  const { current, location, forecast } = weatherData || {};

  return (
    <ScrollView>
      <SafeAreaView className="flex-1 relative h-[100vh]">
        <StatusBar style="dark" />
        <Image
          blurRadius={70}
          source={require("../assets/images/bg.png")}
          className="absolute w-full h-full"
        />
        {loading ? (
          <View className="flex-1 items-center justify-center">
            <Text className="text-white font-psemibold text-3xl mb-3">
              ...Loading...
            </Text>
            <Progress.Circle
              thickness={10}
              size={50}
              indeterminate={true}
              color="white"
            />
          </View>
        ) : (
          <>
            <View>
              {/* search section */}
              <View className="mx-4 relative z-50 h-[7%] mt-5">
                <View
                  className={`${
                    showSearch ? "bg-slate-400" : "bg-transparent"
                  } h-12 rounded-full opacity-75 flex flex-row items-center justify-end`}
                >
                  {showSearch ? (
                    <TextInput
                      onChangeText={handeTextDebounce}
                      placeholder="Search City"
                      placeholderTextColor={"lightgray"}
                      className="pl-6 h-10 flex-1 text-base text-white"
                    />
                  ) : null}

                  <TouchableOpacity
                    onPress={() => toogleSearch(!showSearch)}
                    className="rounded-full p-3 m-1 bg-slate-400"
                  >
                    <Image
                      source={require("../assets/images/search.png")}
                      className="w-5 h-5"
                    />
                  </TouchableOpacity>
                </View>
              </View>
              {locations.length > 0 && showSearch ? (
                <View className="z-50 absolute w-full bg-gray-300 top-[72px] rounded-3xl">
                  {locations.map((location, index) => {
                    let showBorder = index + 1 !== locations.length;
                    let borderClass = showBorder
                      ? "border-b-[1px] border-b-gray-400"
                      : "";
                    return (
                      <TouchableOpacity
                        key={index}
                        className={`p-3 ${borderClass} flex-row items-center gap-1`}
                        onPress={() => handleLocation(location)}
                      >
                        <Image
                          source={require("../assets/images/location.png")}
                          className="w-5 h-5"
                        />
                        <Text className="text-black text-md ml-2">
                          {location.name}, {location.country}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              ) : null}
            </View>
            {/* forecast section */}
            <View className="mx-4 flex justify-around flex-1 mb-2">
              {/* location */}
              <Text className="text-white text-center text-2xl font-bold">
                {location?.name},
                <Text className="text-lg font-semibold text-gray-300">
                  {" " + location?.country}
                </Text>
              </Text>
              {/* weather images */}
              <View className="flex flex-row justify-center">
                <Image
                  source={weatherIcons[current?.condition.text]}
                  className="w-48 h-48"
                />
              </View>
              {/* temperature */}
              <View className="space-y-2">
                <Text className="text-center text-white text-5xl font-bold">
                  {current?.temp_c}&#176;
                </Text>
                <Text className="text-center text-white text-xl tracking-widest">
                  {current?.condition.text}
                </Text>
              </View>
              {/* other status */}
              <View className="flex-row justify-between mx-4">
                <View className="flex-row space-x-2 items-center">
                  <Image
                    source={require("../assets/icons/wind.png")}
                    className="w-6 h-6"
                  />
                  <Text className="text-white font-semibold text-base">
                    {current?.wind_kph}km/h
                  </Text>
                </View>
                <View className="flex-row space-x-2 items-center">
                  <Image
                    source={require("../assets/icons/drop.png")}
                    className="w-6 h-6"
                  />
                  <Text className="text-white font-semibold text-base">
                    {current?.humidity}%
                  </Text>
                </View>
                <View className="flex-row space-x-2 items-center">
                  <Image
                    source={require("../assets/icons/sun.png")}
                    className="w-6 h-6"
                  />
                  <Text className="text-white font-semibold text-base">
                    {forecast?.forecastday[0].astro.sunrise}
                  </Text>
                </View>
              </View>
            </View>
            {/* forcast for next days */}
            <View className="mb-2 space-y-3">
              <View className="flex-row items-center mx-5 space-x-2">
                <Image
                  source={require("../assets/icons/calender.png")}
                  className="w-6 h-6"
                />
                <Text className="text-white text-base">Daily Forecast</Text>
              </View>
              <ScrollView
                horizontal={true}
                contentContainerStyle={{ paddingHorizontal: 15 }}
                showsHorizontalScrollIndicator={false}
              >
                {forecast?.forecastday.map((item, index) => {
                  let date = new Date(item.date);
                  let options = { weekday: "long" };
                  let day = date.toLocaleDateString("en-US", options);
                  day = day.split(",");
                  return (
                    <View
                      key={index}
                      className="bg-slate-400 opacity-75 flex justify-center items-center w-24 rounded-3xl py-3 space-y-1 mr-4"
                    >
                      <Image
                        source={weatherIcons[item.day.condition.text]}
                        className="w-11 h-11"
                      />
                      <Text className="text-white">{day}</Text>
                      <Text className="text-white text-xl font-semibold">
                        {item.day.avgtemp_c}&#176;
                      </Text>
                    </View>
                  );
                })}
              </ScrollView>
            </View>
          </>
        )}
      </SafeAreaView>
    </ScrollView>
  );
}
