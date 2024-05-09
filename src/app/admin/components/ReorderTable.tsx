import React, {
  Dispatch,
  SetStateAction,
  useState,
  DragEvent,
  FormEvent,
} from "react";
import { motion } from "framer-motion";
import { Persons } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { updateAllPersons } from "@/lib/api";
import { LoadingButton } from "@/components/ui/loading-button";
import { useToast } from "@/components/ui/use-toast";

type ColumnProps = {
  title: string;
  cards: Persons[];
  column: ColumnType;
  setCards: Dispatch<SetStateAction<Persons[]>>;
  persons: Persons[];
  setPersons: (persons: Persons[]) => void;
  openReorder: boolean;
  setOpenReorder: (openReorder: boolean) => void;
  setRefetchData: (refetchData: boolean) => void;
};

type ColumnType = "reorder";

type CardProps = CardType & {
  handleDragStart: Function;
  person: Persons;
};

type CardType = {
  title: string;
  id: string;
  column: ColumnType;
  handleRadioChange: Function;
};

type DropIndicatorProps = {
  beforeId: string | null;
  column: string;
};

export const ReorderTable = ({persons, setPersons, openReorder, setOpenReorder, setRefetchData}: {persons: Persons[], setPersons: (persons: Persons[]) => void, openReorder: boolean, setOpenReorder: (openReorder: boolean) => void, setRefetchData: (refetchData: boolean) => void}) => {
  return (
    <div className="h-screen w-full bg-secondary text-primary pb-24">
      <Board persons={persons} setPersons={setPersons} openReorder={openReorder} setOpenReorder={setOpenReorder} setRefetchData={setRefetchData} />
    </div>
  );
};

const Board = ({persons, setPersons, openReorder, setOpenReorder, setRefetchData}: {persons: Persons[], setPersons: (persons: Persons[]) => void, openReorder: boolean, setOpenReorder: (openReorder: boolean) => void, setRefetchData: (refetchData: boolean) => void}) => {
  const [cards, setCards] = useState(persons);

  return (
    <div className="flex h-full w-full gap-3 p-12">
      <Column
        title="Reorder"
        column="reorder"
        cards={cards}
        setCards={setCards}
        persons={persons}
        setPersons={setPersons}
        openReorder={openReorder}
        setOpenReorder={setOpenReorder}
        setRefetchData={setRefetchData}
      />
    </div>
  );
};

const Column = ({ title, cards, column, setCards, persons, setPersons, openReorder, setOpenReorder, setRefetchData }: ColumnProps) => {
  const [active, setActive] = useState(false);

  const handleDragStart = (e: DragEvent, person: Persons) => {
    e.dataTransfer.setData("personId", person.id);
  };

  const handleDragEnd = (e: DragEvent) => {
    const personId = e.dataTransfer.getData("personId");
  
    setActive(false);
    clearHighlights();
  
    const indicators = getIndicators();
    const { element } = getNearestIndicator(e, indicators);
  
    const before = element.dataset.before || "-1";
  
    if (before !== personId) {
      const copy = [...persons];
  
      const personToTransfer = copy.find((p) => p.id === personId);
      if (!personToTransfer) return;
      const newPersons = copy.filter((p) => p.id !== personId);
  
      const moveToBack = before === "-1";
  
      let updatedPersons;
      if (moveToBack) {
        updatedPersons = [...newPersons, personToTransfer];
      } else {
        const insertAtIndex = newPersons.findIndex((el) => el.id === before);
        if (insertAtIndex === undefined) return;
  
        newPersons.splice(insertAtIndex, 0, personToTransfer);
        updatedPersons = newPersons;
      }
  
      const reorderedPersons = updatedPersons.map((person) => ({
        ...person,
        id: person.id, 
      }));
  
      setPersons(reorderedPersons);
    }
  };
  
  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    highlightIndicator(e);

    setActive(true);
  };

  const clearHighlights = (els?: HTMLElement[]) => {
    const indicators = els || getIndicators();

    indicators.forEach((i) => {
      i.style.opacity = "0";
    });
  };

  const highlightIndicator = (e: DragEvent) => {
    const indicators = getIndicators();

    clearHighlights(indicators);

    const el = getNearestIndicator(e, indicators);

    el.element.style.opacity = "1";
  };

  const getNearestIndicator = (e: DragEvent, indicators: HTMLElement[]) => {
    const DISTANCE_OFFSET = 50;

    const el = indicators.reduce(
      (closest, child) => {
        const box = child.getBoundingClientRect();

        const offset = e.clientY - (box.top + DISTANCE_OFFSET);

        if (offset < 0 && offset > closest.offset) {
          return { offset: offset, element: child };
        } else {
          return closest;
        }
      },
      {
        offset: Number.NEGATIVE_INFINITY,
        element: indicators[indicators.length - 1],
      }
    );

    return el;
  };

  const getIndicators = () => {
    return Array.from(
      document.querySelectorAll(
        `[data-column="${column}"]`
      ) as unknown as HTMLElement[]
    );
  };

  const handleDragLeave = () => {
    clearHighlights();
    setActive(false);
  };

  const [selectedPerson, setSelectedPerson] = useState<Persons | null>(null);
  const [targetIndex, setTargetIndex] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleRadioChange = (person: Persons) => {
    setSelectedPerson(person);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTargetIndex(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log("Selected Person: ", selectedPerson);
    console.log("Target Index: ", targetIndex);

    if (!selectedPerson || targetIndex === "") return;

    console.log("Target Index: ", targetIndex)

    const index = parseInt(targetIndex) - 1;

    const filteredPersons = persons.filter(p => p.id !== selectedPerson.id);

    const updatedPersons = [...filteredPersons];
    updatedPersons.splice(index, 0, selectedPerson);

    setPersons(updatedPersons);
    setSelectedPerson(null);
    setTargetIndex("");
  };

  async function handleSave(persons: Persons[]) {
    setLoading(true);

    const updateIds = (persons: Persons[]) => {
      return persons.map((person, index) => ({
        ...person,
        id: `${index + 1}`,
      }));
    };

    const updatedPersons = updateIds(persons);
    const response = await updateAllPersons(updatedPersons)

    setOpenReorder(!openReorder);

    setPersons(updatedPersons);
    setRefetchData(true)
    setLoading(false);

    console.log("Final Update Response: ", response)
    toast({ description: "Order updated successfully" });
  }

  return (
    <div className="w-full shrink-0">
      <div className="ml-3 mr-3 sm:mr-8 flex items-center justify-between">
        <h3 className="font-bold text-neutral-700">{title}</h3>
        <span className="rounded text-sm text-neutral-600">
          {cards.length}
        </span>
      </div>
      <div className="ml-3 mb-3">
        <span className="text-[11px] rounded">
          Drag and drop to reorder the list
        </span>
      </div>
      <div
        onDrop={handleDragEnd}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className="h-full w-full transition-colors bg-neutral-800/0 overflow-y-scroll border border-neutral-200 p-3"
      >
        
        <RadioGroup defaultValue="1" className="gap-0">
          {persons.map((p) => {
            return <Card key={p.id} id={p.id} title={p.firstName + " " + p.lastName} column={"reorder"} person={p} handleDragStart={handleDragStart} handleRadioChange={handleRadioChange} />;
          })}
        </RadioGroup>
        <DropIndicator beforeId={null} column={column} />
      </div>
      <div className="flex justify-between mt-2 gap-2">
        <form onSubmit={handleSubmit} className="flex flex-row gap-2">
          <Input
            type="text"
            value={targetIndex}
            onChange={handleInputChange}
            placeholder="Enter target index"
          />
          <Button type="submit">Move</Button>
        </form>
        <LoadingButton loading={loading} onClick={() => handleSave(persons)}>
          Save
        </LoadingButton>
      </div>
    </div>
  );
};

const Card = ({ title, id, column, handleDragStart, person, handleRadioChange }: CardProps) => {
  return (
    <>
      <DropIndicator beforeId={id} column={column} />
      <motion.label
        layout
        layoutId={id}
        draggable="true"
        onDragStart={(e) => handleDragStart(e, { person, title, id, column })}
        className="flex flex-row gap-2 items-center justify-start cursor-grab rounded border border-neutral-300 bg-secondary p-2 active:cursor-grabbing"
        htmlFor={id}
      >
        <RadioGroupItem value={id} id={id} onClick={() => handleRadioChange(person)} />
        <Label htmlFor={id} className="text-sm text-primary">{person.firstName + " " + person.lastName}</Label>
      </motion.label>
    </>
  );
};

const DropIndicator = ({ beforeId, column }: DropIndicatorProps) => {
  return (
    <div
      data-before={beforeId || "-1"}
      data-column={column}
      className="my-0.5 h-0.5 w-full bg-primary opacity-0"
    />
  );
}