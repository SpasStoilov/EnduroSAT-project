import './parameter-display.css';
import { ReactComponent as DisplayPanel } from '../../assets/display-panel.svg';
import Logo from '../../assets/EnduroSat-log.png';
import { useEffect, useRef, useState  } from "react";
import { useGetStoreState } from '../../custom-hook-utils/getStoreState';

let initBatteryCharge1Lenght = 0
let initBatteryCharge2Lenght = 0

const queryHelper = {
  batteryCharge1: ".cls-18",
  totalAmountOfCharge1: "#V1 > .cls-27",
  batteryCharge2: ".cls-26",
  totalAmountOfCharge2: "#V2 > .cls-27",
  drawAmountOBC: "#A1 > .cls-22",
  drawAmountCamera: "#A2 > .cls-22",
  bar1: "#bar1 > .cls-32",
  bar2: "#bar2 > .cls-32"
}

function ParameterDisplay() {

  // Get the satellite state:
  const [satellite, _] = useGetStoreState("satellite")

  const svgDisplayPanelRef = useRef(null);

  useEffect(()=>{
    //console.log("SAT-state >>>", satellite);

    if (svgDisplayPanelRef){

      const chargeBlock1 = (svgDisplayPanelRef as any).current.querySelector(queryHelper.batteryCharge1)
      const chargeBlock2 = (svgDisplayPanelRef as any).current.querySelector(queryHelper.batteryCharge2)
      const totalAmountOfChargeVolt1 = (svgDisplayPanelRef as any).current.querySelector(queryHelper.totalAmountOfCharge1)
      const totalAmountOfChargeVolt2 = (svgDisplayPanelRef as any).current.querySelector(queryHelper.totalAmountOfCharge2)

      if (!initBatteryCharge1Lenght){
        initBatteryCharge1Lenght = chargeBlock1.getBoundingClientRect().height + 45
      }
      if (!initBatteryCharge2Lenght){
        initBatteryCharge2Lenght = chargeBlock2.getBoundingClientRect().height + 45
      }

      const newHeight1 = initBatteryCharge1Lenght*satellite.batteries.totalChargeAmount.charge1.procentValue
      chargeBlock1.style.height = `${newHeight1}px`

      const newHeight2 = initBatteryCharge2Lenght*satellite.batteries.totalChargeAmount.charge2.procentValue
      chargeBlock2.style.height = `${newHeight2}px`

      const totalChargeInVolts1 = satellite.batteries.totalChargeAmount.charge1.stringValue
      totalAmountOfChargeVolt1.textContent = totalChargeInVolts1

      const totalChargeInVolts2 = satellite.batteries.totalChargeAmount.charge2.stringValue
      totalAmountOfChargeVolt2.textContent = totalChargeInVolts2

      const drawAmountOBC = (svgDisplayPanelRef as any).current.querySelector(queryHelper.drawAmountOBC)
      const drawAmountCamera = (svgDisplayPanelRef as any).current.querySelector(queryHelper.drawAmountCamera)

      const drawAmount1 = satellite.payloads.currentDrawAmount.OBC
      drawAmountOBC.textContent = drawAmount1
      drawAmountOBC.style.fontSize = `30px`
      
      const drawAmount2 = satellite.payloads.currentDrawAmount.Camera
      drawAmountCamera.textContent = drawAmount2
      drawAmountCamera.style.fontSize = `30px`
  
      const barOBCAll = (svgDisplayPanelRef as any).current.querySelectorAll(queryHelper.bar1)
      const barCameraAll = (svgDisplayPanelRef as any).current.querySelectorAll(queryHelper.bar2)

      for (let path of barOBCAll){
        path.style.fill = satellite.payloads.scaleDrawAmplitude.OBC[1]
      }
      for (let path of barCameraAll){
        path.style.fill = satellite.payloads.scaleDrawAmplitude.Camera[1]
      }
    }
  }, [
    satellite,
  ])

  return (
    <div className="ParameterDisplay">
      <img src={Logo} alt="PNG" className="logo"/>
      <DisplayPanel ref={svgDisplayPanelRef} style={{ width: '800px', height: '600px', zIndex:2, alignSelf:"center"}}/>
    </div>
  );
}

export default ParameterDisplay;
