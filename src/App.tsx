import Controls from "./components/Controls";
import PersonInfo from "./components/PersonInfo";
import { useContacts } from "./hooks/useContacts";

function App() {
  const {
    contacts,
    loading,
    error,
    selectedCount,
    isSelected,
    toggleSelect,
    loadMore,
    retry,
  } = useContacts();

  return (
    <div className="App">
      <div className="selected">Selected contacts: {selectedCount}</div>
      <div className="list">
        {contacts.map((personInfo) => (
          <PersonInfo
            key={personInfo.id}
            data={personInfo}
            selected={isSelected(personInfo.id)}
            onToggle={() => toggleSelect(personInfo.id)}
          />
        ))}
      </div>
      <Controls
        loading={loading}
        error={error}
        onRetry={retry}
        onLoadMore={loadMore}
      />
    </div>
  );
}

export default App;
