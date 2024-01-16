import './App.css';
import { useEffect, useReducer, useState } from "react";
import { 
    fetchSatelliteState, 
    setCurrentDrawAmount, 
    setTotalChargeAmount, 
    setScaleDrawAmplitude, 
    setMessenger, 
    setBatteriesCommonValues,
    setDisconnectedPayloads
} from  "./states/satellite/satellite"

import { useGetStoreState } from './custom-hook-utils/getStoreState';
// Components
import CommandingPanel from "./components/commanding/commanding-panel"
import NotificationsPanel from "./components/notifications/notifications-panel"
import ParameterDisplay from "./components/parameters/parameter-display"
import { commands } from './states/satellite/types';

const requestInterval = 2000

const setCommand = (state:any, action:commands)=>{
  state.commands = {...state.commands, ...action}
  return state
}

/**
 * Application
 * @returns 
 */
function App() {

  let [idInterval, setIdInterval] = useState<any>("")
  let [comandsState, dispatchCommand] = useReducer(setCommand, {commands: {}})
  const [ _ , dispatch] = useGetStoreState("satellite")

  useEffect(()=>{
    const intervalId = setInterval(()=>{
      dispatch(fetchSatelliteState(comandsState.commands))
      dispatch(setBatteriesCommonValues())
      dispatch(setDisconnectedPayloads())
      dispatch(setTotalChargeAmount())
      dispatch(setCurrentDrawAmount())
      dispatch(setScaleDrawAmplitude())
      dispatch(setMessenger())
    }, requestInterval)

    setIdInterval(intervalId)

    return ()=>{
      clearInterval(idInterval)
    }
  }, [])
  
  return (
    <div className="App">
      <ParameterDisplay />
      <NotificationsPanel />
      <CommandingPanel dispatchCommand={dispatchCommand}/>
    </div>
  );
}

export default App;
