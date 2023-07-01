import React, { useEffect, useLayoutEffect , useState} from 'react'
import { View, Text, SafeAreaView,Image, TextInput, ScrollView, TouchableOpacity, ActivityIndicator} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { Attractions, Avatar, Hotels, NotFound, Restaurants } from '../assets';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import MenuContainer from '../components/MenuContainer';

import {MaterialCommunityIcons} from '@expo/vector-icons'
import ItemCardContainer from '../components/ItemCardContainer';
import { getPlacesData } from '../api/Index';
const { GOOGLE_API } = require('../config');
const googleApiKey = GOOGLE_API;
const Discover = () => {
  const navigation = useNavigation();

  const [type, setType] = useState("restaurants");
  const [isLoading, setIsLoading] = useState(false);
  const [mainData, setMainData] = useState([]);
  const [bl_lat, setBl_lat] = useState(null);
  const [bl_lng, setBl_lng] = useState(null);
  const [tr_lat, setTr_lat] = useState(null);
  const [tr_lng, setTr_lng] = useState(null);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  useEffect(() => {
    setIsLoading(true);
    getPlacesData(bl_lat, bl_lng, tr_lat, tr_lng, type).then((data) => {
      setMainData(data);
      setInterval(() => {
        setIsLoading(false);
      }, 2000);
    });
  }, [bl_lat, bl_lng, tr_lat, tr_lng, type]);

  return (
    <>
    {/*  TITLE LINES */}
    <SafeAreaView className="flex-1 bg-white relative">
    <View className="flex-row items-center justify-between px-8">
        <View>
            <Text className="text-[40px] text-[#0B646B] font-bold">Discover</Text>
            <Text className=" text-[#527283] text-[36px]">The beauty today</Text>
        </View>
        <View className="w-12 h-12 bg-gray-400 rounded-md shadow-md ">
            <Image
                source={Avatar}
                className="w-full h-full rounded-md object-cover"
            />
        </View>
    </View>


    {/* SEARCH BAR */}

    <View className="flex-row items-center bg-red mx-4 rounded-xl py-1 px-4 shadow-md mt-4">
    <GooglePlacesAutocomplete
        GooglePlacesDetailsQuery={{fields: "geometry"}}
      placeholder='Search'
      fetchDetails={true}

      onPress={(data, details = null) => {
        // 'details' is provided when fetchDetails = true
        console.log(details?.geometry?.viewport);
        setBl_lat(details?.geometry?.viewport?.southwest?.lat);
        setBl_lng(details?.geometry?.viewport?.southwest?.lng);
        setTr_lat(details?.geometry?.viewport?.northeast?.lat);
        setTr_lng(details?.geometry?.viewport?.northeast?.lng);
      }}
      query={{
        key: googleApiKey,
        language: 'en',
      }}
    />
    </View>


    {/* MENU OPTIONS */}
    {isLoading ? 
    <View className="flex-1  items-center justify-center">
        <ActivityIndicator size={'large'} color={"#0B646B"}/>
    </View> :
        <ScrollView>
        <View className="flex-row items-center justify-between px-8 mt-8"> 
            <MenuContainer
              key={"hotel"}
              title="Hotels"
              imageSrc= {Hotels}
              type= {type}
              setType = {setType}
            />
            <MenuContainer
              key={"attractions"}
              title="Attractions"
              imageSrc= {Attractions}
              type= {type}
              setType = {setType}
            />
              <MenuContainer
              key={"hotels"}
              title="Restaurants"
              imageSrc= {Restaurants}
              type= {type}
              setType = {setType}
            />
        </View>


        {/* INFORMATION SECTION */}
        
        <View>

          <View className="flex-row  items-center justify-between px-4 mt-8">
            <Text className="text-[#2C7379] text-[28px] font-bold">Top Picks</Text>
            <TouchableOpacity className="flex-row  items-center justify-center space-x-2">
              <Text className="text-[#A0c4c7] text-[20px] font-bold">Explore</Text>
                <MaterialCommunityIcons
                  name='arrow-right-thick'
                  color={"#A0C4C7"}
                  size={24}
                />
            </TouchableOpacity>
          </View >

          <View className="px-4 mt-8 flex-row items-center justify-evenly flex-wrap">
            {mainData?.length> 0 ? 
            <>
                {mainData?.map((data, i) => (
                    <ItemCardContainer
                      key={i}
                      imageSrc={
                        data?.photo?.images?.medium?.url
                          ? data?.photo?.images?.medium?.url
                          : "https://cdn.pixabay.com/photo/2015/10/30/12/22/eat-1014025_1280.jpg"
                      }
                      title={data?.name}
                      location={data?.location_string}
                      data={data}
                    />
                  ))}
            </> : <>
            <View className="w-full h-[400px] justify-center items-center space-y-8 ">
              <Image
                source={NotFound}
                className="w-32 h-32 object-cover "
              />

              <Text className=" text 2-xl text-[#428288] font-semibold">OPPS... NO DATA FOUND</Text>
            </View>
            </>}
          </View>
        </View>

      </ScrollView>
    }
    </SafeAreaView>

    </>
  )
}

export default Discover