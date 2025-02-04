import React, { useEffect, useState } from "react";
import "./Elevator.css";

const Elevator = () => {
  const floors = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1];
  const [ElevatorFloor, setElevatorFloor] = useState(1);
  const [ElevatorIsUp, setElevatorIsUp] = useState(true);
  const [ElevatorIsMoving, setElevatorIsMoving] = useState(false);
  const [calls, setCalls] = useState([]);

  const CallElevator = (floor, up) => {
    setCalls((prevCalls) => [
      ...prevCalls,
      {
        up: up,
        floor: floor,
      },
    ]);
  };

  useEffect(() => {
    //Toda vez que o elevador mudar de nível ou adicionar um chamado ele vai chamar o elevador
    //se houver chamados pendentes e o elevador não estiver em movimento
    console.log("useEffect", calls.length > 0 ,  !ElevatorIsMoving);

    if (calls.length > 0 && !ElevatorIsMoving) {
      setTimeout(() => {
        goElevator();
      }, 3000);
    } 
    // else if (calls.length === 0 && !ElevatorIsMoving && ElevatorFloor !== 1) {
    //   setTimeout(() => {
    //     setElevatorFloor(1);
    //   }, 10000);
    
  }, [calls, ElevatorFloor, ElevatorIsUp]);


  const goElevator = () => {
    setElevatorIsMoving(true);

    const move = () => {
      console.log("move", calls.length);

      if (calls.length === 0) {
        setElevatorIsMoving(false);
        return;
      }

      let line;
      console.log("elevetorfloor", ElevatorIsUp);

      if (ElevatorIsUp) {
        //Se o elevador estiver em subindo faz uma fila de chamados que estão acima do elevador
        line = calls.filter(
          (call) =>  call.floor >= ElevatorFloor
        );

        if (line.length > 0) {
          //se a fila for maior que 0 ele vai subir um andar e remover o chamado pendente daquele andar se houver
          console.log('calls', calls);
          let newCalls = calls.filter(
            (call) => call.floor != ElevatorFloor + 1 || call.up == false
          );
          console.log('removeCalls', newCalls);
          
          setElevatorFloor(ElevatorFloor + 1);
          setCalls(newCalls);
          setElevatorIsMoving(false);
        } else {
          //se não ha mais subida ele ira mudar para baixo e verificar se há chamados pendentes
          setElevatorIsUp(false);
          setElevatorIsMoving(false);
          
        }
      } else {
        console.log('here');
        
        //Se o elevador estiver em descendo faz uma fila de chamados que estão abaixo do elevador
        line = calls.filter(
          (call) => call.up === false && call.floor <= ElevatorFloor
        );

        if (line.length > 0) {
          //se a fila for maior que 0 ele vai subir um andar e remover o chamado pendente daquele andar se houver
          setTimeout(() => {
            setElevatorFloor(ElevatorFloor - 1);
            let removeCalls = calls.filter(
              (call) => call.floor != ElevatorFloor - 1 || call.up == true
            );
            setCalls(removeCalls);
            setElevatorIsMoving(false);
          }, 5000);
        } else {
          //se não ha mais subida ele ira mudar para baixo e verificar se há chamados pendentes
          console.log("again");

          setElevatorIsUp(true);
          setElevatorIsMoving(false);

        }
      }
    };

    move();
  };

  return (
    <div className="elevator-container">
    <div className="building-diagram">
      <h2>Diagrama do Prédio</h2>
      <div className="shaft">
        {floors.map((floor) => (
          <div key={floor} className="floor-diagram">
            <div>{floor} - Andar</div>
            {ElevatorFloor === floor && <div className="elevator-here">🚪 Elevador: {floor} 🚪</div>}
          </div>
        ))}
      </div>
    </div>
    <div className="floors">
      {floors.map((floor) => (
        <div key={floor} className="floor">
          <div>{floor} - Andar</div>
          {ElevatorFloor === floor && <div className="elevator-here">🚪 Elevador 🚪</div>}
          <button className="call-btn" onClick={() => CallElevator(floor, true)}>Subir</button>
          <button className="call-btn" onClick={() => CallElevator(floor, false)}>Descer</button>
        </div>
      ))}
    </div>
    <div className="control-panel">
      <h1>Painel de Controle</h1>
      <div className="grid-panel">
        {floors.map((floor) => (
          <div key={floor} className="control">
            <div>{floor}</div>
            <button className="go-btn" onClick={() => CallElevator(floor, floor > ElevatorFloor)}>
              Ir - {floor}
            </button>
          </div>
        ))}
      </div>
    </div>
  </div>
  );
};

export default Elevator;
