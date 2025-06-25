import { DirectoryPreview } from "./Preview";
import { Departments, Persons, Positions } from "@/lib/types";
import { PersonsViewPaginated } from "../PersonsView/PersonsViewPaginated";
import { DirectoryPreviewPaginated } from "./DirectoryPreviewPaginated";

type MainContainerProps = {
  activePage: string;
  positions: Positions[];
  setPositions: (positions: Positions[]) => void;
  departments: Departments[];
  setDepartments: (departments: Departments[]) => void;
  loading: boolean;
  maxId: number; // Keep this for now but it will be calculated in PersonsViewPaginated
  refetchData: boolean;
  setRefetchData: (refetchData: boolean) => void;
};

const MainContainer: React.FC<MainContainerProps> = ({
  activePage,
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
        <DirectoryPreviewPaginated
          positions={positions}
          departments={departments}
          setPositions={setPositions}
          setDepartments={setDepartments}
        />
      );
    case "forms":
      return (
        <PersonsViewPaginated
          positions={positions}
          departments={departments}
          setPositions={setPositions}
          setDepartments={setDepartments}
          maxId={maxId}
          setRefetchData={setRefetchData}
        />
      );
    default:
      return <div></div>;
  }
};

export default MainContainer;
