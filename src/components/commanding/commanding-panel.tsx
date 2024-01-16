import { useState } from 'react';
import './commanding-panel.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSatellite } from '@fortawesome/free-solid-svg-icons';
import { useGetStoreState } from '../../custom-hook-utils/getStoreState';
import { PayloadsTypes } from '../../states/satellite/types';

function CommandingPanel(prop:any) {

  const [satellite, _] = useGetStoreState("satellite")

  function togglePanel(e:React.MouseEvent<HTMLHeadingElement>) {
    const commandPanel = e.currentTarget.parentElement;
    
    if (commandPanel){
      let toggleMe = commandPanel.classList.toggle('closed')

      const display = toggleMe ? "none" : "block"

      let childrenButtons = Array.from(commandPanel.querySelectorAll('button'))

      for(let child of childrenButtons){
        child.style.display = display
      }
      const ParameterDisplay = (document.querySelector(".ParameterDisplay") as HTMLDivElement)
      if (ParameterDisplay){
        ParameterDisplay.classList.toggle('closed')
      }
    }
  }

  function payloadClassName(payloadName: "OBC" | "Camera", disconnected:boolean|null){
    return {
      classN: disconnected 
        ? `btn-${payloadName}-connect-false` 
        : `btn-${payloadName}-connect-true`
      ,
      text: disconnected 
        ? `Connect ${payloadName}`
        : `Disconnect ${payloadName}`
      }
  }

  let [obcClassData, setOBCData] = useState<{classN:string, text:string}>(
    payloadClassName("OBC", satellite.payloads.disconnected.OBC)
  )

  let [cameraClassData, setCameraData] = useState<{classN:string, text:string}>(
    payloadClassName("Camera", satellite.payloads.disconnected.Camera)
  )
  
  function disconnect(e:React.MouseEvent<HTMLButtonElement>){

    const parts = e.currentTarget.className.split("-")

    const payloadName: PayloadsTypes = (parts[1] as PayloadsTypes.First | PayloadsTypes.Second)

    const disconnected = 
      satellite.payloads.disconnected[payloadName]  
        ? false 
        : true

    if(payloadName == "Camera"){
      setCameraData(payloadClassName(payloadName, disconnected))
    }
    else {
      setOBCData(payloadClassName(payloadName, disconnected))
    }

    prop.dispatchCommand(
      {
        [`payloadsDisconnected/${payloadName}`]:{
              value: disconnected
        }
      }
    )
    
  }

  return (
    <div className="CommandingPanel">
      <h2 className='commands-title' onClick={togglePanel}>
        <FontAwesomeIcon icon={faSatellite}/> Command Panel
      </h2>
      <button className={obcClassData.classN} onClick={disconnect}>
        {obcClassData.text}
      </button>
      <button className={cameraClassData.classN} onClick={disconnect}>
        {cameraClassData.text}
      </button>
    </div>
  );
}

export default CommandingPanel;
