import { Contact } from "src/hooks/useContacts";

type Props = {
  data: Contact;
  selected: boolean;
  onToggle: () => void;
};

function PersonInfo(props: Props) {
  const { data, selected, onToggle } = props;

  return (
    <div
      onClick={onToggle}
      className="person-card"
      style={{
        outline: selected ? "3px solid #4f46e5" : "none",
        order: selected ? 0 : 1,
      }}
    >
      <div className="person-top">
        <div className="avatar">
          {data.firstNameLastName[0]}
          {data.firstNameLastName.split(" ")[1]?.[0]}
        </div>

        <div className="info">
          <div className="name">{data.firstNameLastName}</div>
          <div className="title">{data.jobTitle}</div>
        </div>
      </div>

      <div className="email">{data.emailAddress}</div>
    </div>
  );
}

export default PersonInfo;
