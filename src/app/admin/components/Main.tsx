import { PersonsView } from "@/app/admin/PersonsView/PersonsView";
import { DirectoryPreview } from "./Preview";
import { Departments, Persons, Positions } from "@/lib/types";

type MainContainerProps = {
  activePage: string;
  persons: Persons[];
  setPersons: (persons: Persons[]) => void;
  positions: Positions[];
  setPositions: (positions: Positions[]) => void;
  departments: Departments[];
  setDepartments: (departments: Departments[]) => void;
  loading: boolean;
  maxId: number;
  refetchData: boolean;
  setRefetchData: (refetchData: boolean) => void;
};

const MainContainer: React.FC<MainContainerProps> = ({
  activePage,
  persons,
  setPersons,
  positions,
  setPositions,
  departments,
  setDepartments,
  loading,
  maxId,
  setRefetchData,
}) => {
  switch (activePage) {
    case "preview":
      return (
        <DirectoryPreview
          persons={persons}
          loading={loading}
          positions={positions}
          departments={departments}
          setPositions={setPositions}
          setDepartments={setDepartments}
        />
      );
    case "forms":
      return (
        <PersonsView
          persons={persons}
          setPersons={setPersons}
          positions={positions}
          departments={departments}
          setPositions={setPositions}
          setDepartments={setDepartments}
          loading={loading}
          maxId={maxId}
          setRefetchData={setRefetchData}
        />
      );
    default:
      return <div></div>;
  }
};

export default MainContainer;
