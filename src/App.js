import React, { useEffect, useState } from "react";
import './Elevator.css';


const Elevator = () => {
  const floors = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1];
  const [ElevatorFloor, setElevatorFloor] = useState(5);
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
    console.log("useEffect", calls.length > 0 && !ElevatorIsMoving);

    if (calls.length > 0 && !ElevatorIsMoving) {
      setTimeout(() => {
        goElevator();
      }, 3000);
    }
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
          (call) => call.up === true && call.floor >= ElevatorFloor
        );

        if (line.length > 0) {
          //se a fila for maior que 0 ele vai subir um andar e remover o chamado pendente daquele andar se houver
          setElevatorFloor(ElevatorFloor + 1);
          let removeCalls = calls.filter(
            (call) => call.floor != ElevatorFloor + 1
          );
          setCalls(removeCalls);
          setElevatorIsMoving(false);
        } else {
          //se não ha mais subida ele ira mudar para baixo e verificar se há chamados pendentes
          setElevatorIsUp(false);
          setElevatorIsMoving(false);
        }
      } else {
        //Se o elevador estiver em descendo faz uma fila de chamados que estão abaixo do elevador
        line = calls.filter(
          (call) => call.up === false && call.floor <= ElevatorFloor
        );

        if (line.length > 0) {
          //se a fila for maior que 0 ele vai subir um andar e remover o chamado pendente daquele andar se houver
          setElevatorFloor(ElevatorFloor - 1);
          let removeCalls = calls.filter(
            (call) => call.floor != ElevatorFloor - 1
          );
          setCalls(removeCalls);
          setElevatorIsMoving(false);
        } else {
          //se não ha mais subida ele ira mudar para baixo e verificar se há chamados pendentes
          console.log("again");

          setElevatorIsUp(false);

          line = calls.filter(
            (call) => call.up == false && call.floor <= ElevatorFloor
          );

          if (line.length > 0) {
            //se a fila for maior que 0 ele vai subir um andar e remover o chamado pendente daquele andar se houver
            setElevatorFloor(ElevatorFloor - 1);
            let removeCalls = calls.filter(
              (call) => call.floor != ElevatorFloor - 1
            );
            setCalls(removeCalls);
            setElevatorIsUp(true);
          } else {
            console.log("no else");

            //se não ha mais subida ele ira mudar para baixo e verificar se há chamados pendentes
            setElevatorIsUp(true);
            setElevatorIsMoving(false);
          }
        }
      }
    };

    move();
  };

  return (
    <div>
      <div>
        {floors.map((floor) => (
          <div key={floor}>
            <div>{floor} - Chamar</div>
            {ElevatorFloor === floor && <div>🚪 Elevador aqui 🚪</div>}
            <button onClick={() => CallElevator(floor, true)}>Call up</button>
            <button onClick={() => CallElevator(floor, false)}>
              Call down
            </button>
          </div>
        ))}
      </div>
      <div>
        <h1>Painel de controle</h1>
        {floors.map((floor)=>(
          <div>
            <div key={floor}>{floor}</div>
            <button onClick={() => CallElevator(floor, floor > ElevatorFloor)}>
            Go - {floor}
                    </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Elevator;
