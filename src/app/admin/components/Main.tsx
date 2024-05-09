import { PersonsView } from '@/app/admin/forms/PersonsView';
import { DirectoryPreview } from './Preview';
import { Persons } from '@/lib/types';

type MainContainerProps = {
  activePage: string;
  persons: Persons[];
  setPersons: (persons: Persons[]) => void;
  loading: boolean;
  maxId: number;
  refetchData: boolean,
  setRefetchData: (refetchData: boolean) => void;
};

const MainContainer: React.FC<MainContainerProps> = ({ activePage, persons, setPersons, loading, maxId, setRefetchData }) => {
  switch (activePage) {
    case 'preview':
      return <DirectoryPreview persons={persons} loading={loading} />
    case 'forms':
      return  <PersonsView persons={persons} setPersons={setPersons} loading={loading} maxId={maxId} setRefetchData={setRefetchData} />
    default:
      return <div></div>;
  }
};

export default MainContainer;