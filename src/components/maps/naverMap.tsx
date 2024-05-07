import NaverMapView, {Path} from 'react-native-nmap';
import React, {useRef, useEffect, useState} from 'react';
import {Keyboard, View} from 'react-native';
import {dummyData} from '../../dummy/data';
import {ANAM} from '../../dummy/coord'; //using dummy as of now
import {useRecoilState} from 'recoil';
import {modalState} from '../../atoms/modalState';
import {Center, Coordinate} from '../../config/types/coordinate';
import {mapCenterState} from '../../atoms/mapCenterState';
import {lastCenterState} from '../../atoms/lastCenterState';
import {getCurPosition} from '../../config/helpers/location';
import CurPosMarker from '../markers/CurPosMarker';
import CurPosButton from '../buttons/CurPosButton';
import {Navigation} from '../../config/types/navigation';
import {navigationState} from '../../atoms/navigationState';
import {DEFAULT_ZOOM, ENLARGE_ZOOM} from '../../config/consts/map';
import NavMarker from '../markers/NavMarker';
import {headerRoughState} from '../../atoms/headerRoughState';
import Spinner from '../spinner';
import {onSelectRouteState} from '../../atoms/onSelectRouteState';
import {getAddress} from '../../api/getAddress';
import {SelectedPath} from '../paths/candidatePaths';
import {loadingState} from '../../atoms/loadingState';

export default function NaverMap({
  selectedPath,
}: {
  selectedPath: Coordinate[] | null;
}) {
  const [, setModalVisible] = useRecoilState<boolean>(modalState);
  const [, setIsRough] = useRecoilState<boolean>(headerRoughState);
  const [, setLastCenter] = useRecoilState<Center>(lastCenterState);
  const [isLoading, setLoading] = useRecoilState<boolean>(loadingState);
  const [nav, setNav] = useRecoilState<Navigation>(navigationState);

  const [center, setCenter] = useRecoilState<Center>(mapCenterState);
  const [curPosition, setCurPosition] = useState<Coordinate>(ANAM);
  const [, setOnSelectRoute] = useRecoilState<boolean>(onSelectRouteState);

  const prevNavRef = useRef<Navigation | null>(nav);
  const isFirstMount = useRef<boolean>(true);

  const setCurPos = async () => {
    try {
      const curPos = await getCurPosition();
      setCurPosition(curPos);
      setCenter({...curPos, zoom: 12}); //Cheat Shortcut for fixing centering bug
      setCenter({...curPos, zoom: DEFAULT_ZOOM});
      if (!nav.start) {
        const res = await getAddress(curPos);
        setNav({
          ...nav,
          start: {
            name: '현위치 : ' + (res.road_address || res.address),
            coordinate: curPos,
          },
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const onUseEffect = async () => {
    if (isFirstMount.current) {
      //FIXME: add permission inquiry for clients (심사에 필요) -> 강의 참고 (중요)
      isFirstMount.current = false;
      prevNavRef.current = nav;
      if (!selectedPath) await setCurPos();
      return;
    }
    //move to corresponding location when start, end, or waypoints are updated
    else if (JSON.stringify(nav) !== JSON.stringify(prevNavRef.current)) {
      if (
        JSON.stringify(nav.start) !==
          JSON.stringify(prevNavRef.current?.start) &&
        nav.start?.coordinate
      ) {
        setCenter({...nav.start.coordinate, zoom: ENLARGE_ZOOM});
      } else if (
        JSON.stringify(nav.wayPoints) !==
        JSON.stringify(prevNavRef.current?.wayPoints)
      ) {
        const wayPoints = nav.wayPoints;
        if (wayPoints.length > 0) {
          const newCenter = {
            ...wayPoints[wayPoints.length - 1].coordinate,
            zoom: ENLARGE_ZOOM,
          };
          setCenter(newCenter);
        }
      } else if (
        JSON.stringify(nav.end) !== JSON.stringify(prevNavRef.current?.end) &&
        nav.end?.coordinate
      )
        setCenter({...nav.end.coordinate, zoom: ENLARGE_ZOOM});

      prevNavRef.current = nav;
    }

    if (nav.start && nav.end) {
      setOnSelectRoute(true);
    } else {
      setIsRough(false);
    }
  };

  useEffect(() => {
    //on Initial Mount only
    onUseEffect();
  }, [nav]);

  //TODO: Make SEARCH ON PATH API request, render the result on the map (OMWMARKER)

  return (
    <View className="relative w-full h-full">
      {isLoading ? (
        <Spinner />
      ) : (
        <>
          <NaverMapView
            style={{
              width: '100%',
              height: '100%',
            }}
            zoomControl={false}
            center={center}
            onMapClick={e => {
              setModalVisible(false);
              Keyboard.dismiss();
            }}
            onCameraChange={e => {
              setLastCenter({
                longitude: e.longitude,
                latitude: e.latitude,
                zoom: e.zoom,
              });
            }}
            onTouch={() => {
              if (nav.start && nav.end) setIsRough(true);
              Keyboard.dismiss();
            }}
            scaleBar
            mapType={0} //0 : Basic, 1 : Navi, 4 : Terrain, etc..
          >
            <CurPosMarker curPosition={curPosition} />
            <NavMarker />
            {
              /* {result && <OmwMarker coordList={result} />} */
              //FIXME: render search results here
            }
            {selectedPath && selectedPath.length > 0 && (
              <SelectedPath
                path={selectedPath} //FIXME: add more options, styles, dynamically render it
              />
            )}
          </NaverMapView>
          <CurPosButton onPress={setCurPos} />
        </>
      )}
    </View>
  );
}
