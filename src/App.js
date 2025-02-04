import React, { useEffect, useState } from "react";
import "./Elevator.css";

const Elevator = () => {
  const floors = [4, 3, 2, 1];
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

  const returnToFirstFloor = () => {
    if (ElevatorFloor > 1 && calls.length === 0) {
      setElevatorIsMoving(true);
      const interval = setInterval(() => {
        setElevatorFloor((prevFloor) => {
          if (prevFloor > 1) return prevFloor - 1;
          clearInterval(interval);
          setElevatorIsMoving(false);
          return 1;
        });
      }, 3000);
    }
  };

  useEffect(() => {
    //Toda vez que o elevador mudar de nível ou adicionar um chamado ele vai chamar o elevador
    //se houver chamados pendentes e o elevador não estiver em movimento
    if (calls.length > 0 && !ElevatorIsMoving) {
      setTimeout(() => {
        goElevator();
      }, 3000);
    } else if (calls.length === 0) {
      // Inicia contagem de 10 segundos para retorno ao térreo
      const returnTimeout = setTimeout(() => {
        returnToFirstFloor();
      }, 10000);
      return () => clearTimeout(returnTimeout);
    }
  }, [calls, ElevatorFloor, ElevatorIsUp]);

  const goElevator = () => {
    setElevatorIsMoving(true);
    const move = () => {
      if (calls.length === 0) {
        setElevatorIsMoving(false);
        return;
      }
      // console.log("elevetorfloor", ElevatorIsUp);
      //Se o elevador estiver em subindo faz uma fila de chamados que estão acima do elevador
      let line = ElevatorIsUp
        ? calls.filter((call) => call.floor >= ElevatorFloor)
        : calls.filter((call) => call.floor <= ElevatorFloor);
      if (line.length > 0) {
        //se a fila for maior que 0 ele vai subir/descer um andar e remover o chamado pendente daquele andar se houver
        //         console.log("calls", calls);
        setTimeout(() => {
          const nextFloor = ElevatorIsUp
            ? ElevatorFloor + 1
            : ElevatorFloor - 1;
          setElevatorFloor(nextFloor);
          let newCalls = calls.filter((call) => call.floor !== nextFloor)
          setCalls(newCalls)
          setElevatorIsMoving(false);
          console.log("removeCalls", newCalls);
        }, 3000);
      } else {
        setElevatorIsUp(!ElevatorIsUp);
        setElevatorIsMoving(false);
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
              {ElevatorFloor === floor && (
                <div className="elevator-here">🚪 Elevador: {floor} 🚪</div>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="floors">
        {floors.map((floor) => (
          <div key={floor} className="floor">
            <div>{floor} - Andar</div>
            {ElevatorFloor === floor && (
              <div className="elevator-here">🚪 Elevador 🚪</div>
            )}
            <button
              className="call-btn"
              onClick={() => CallElevator(floor, true)}
            >
              Chamar
            </button>
            {/* <button className="call-btn" onClick={() => CallElevator(floor, false)}>Descer</button> */}
          </div>
        ))}
      </div>
      <div className="control-panel">
        <h1>Painel de Controle</h1>
        <div className="grid-panel">
          {floors.map((floor) => (
            <div key={floor} className="control">
              <div>{floor}</div>
              <button
                className="go-btn"
                onClick={() => CallElevator(floor, floor > ElevatorFloor)}
              >
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
