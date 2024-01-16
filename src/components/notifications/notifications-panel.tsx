import { useGetStoreState } from '../../custom-hook-utils/getStoreState';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import './notifications-panel.css';

function NotificationsPanel() {

  function togglePanel(e:React.MouseEvent<HTMLHeadingElement>) {
    const notesPanel = e.currentTarget.parentElement;
    
    if (notesPanel){
      notesPanel.classList.toggle('closed')
      const ParameterDisplay = (document.querySelector(".ParameterDisplay") as HTMLDivElement)
      if (ParameterDisplay){
        ParameterDisplay.classList.toggle('wide')
      }
      const CommandPanel = (document.querySelector(".CommandingPanel") as HTMLDivElement)
      if (CommandPanel){
        CommandPanel.classList.toggle('wide')
      }
    }
  }

  const currentDate = new Date();

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1; // Month is zero-based, so we add 1
  const day = currentDate.getDate();
  const hours = currentDate.getHours();
  const minutes = currentDate.getMinutes();
  const seconds = currentDate.getSeconds();

  const currentTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  
  const [satellite, _] = useGetStoreState("satellite")

  const messeges = satellite.messenger.length 
      ? satellite.messenger.map(
          data =>{
            return (
              <>
                <span className="time-msg" key={"t-" + data![0]}>{currentTime}</span>
                <p className="msg" key={"m-" + data![0]}>{data![1]}</p>
              </>
            )
          }
      ) 
      : []

  return (
    <div className="NotificationsPanel">
      <h2 className='notifications-title' onClick={togglePanel}>
        <FontAwesomeIcon icon={faBell}/> Notes</h2>
      {messeges}
    </div>
  );
}

export default NotificationsPanel;
