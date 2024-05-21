const Entry = ({ website_details, deleteFunc }) => {
  const shortenedName = website_details.name.substring(0, 10);
  return (
    <ul className="entry"> 
      <li>
        <span className="left">{shortenedName}</span>
        <span className="right">
          <span className="expire">{website_details.expire}</span>
          <button onClick={() => deleteFunc(website_details)}>DEL</button>
        </span>
      </li>
    </ul>
  );
}


export default Entry;
