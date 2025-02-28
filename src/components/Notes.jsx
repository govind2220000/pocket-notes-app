import styles from "../styles/notes.module.css";
import poster from "/poster.png";
import lock from "/lock.png";
import sendBtn from "/sendBtn.png";
import backBtn from "/back.png";
import { useState, useEffect } from "react";
import getFirstLetters from "../helperFunctions/getFirstLetters";

const Notes = () => {
  // Options for the creating the date format for the noteContent
  const options = {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  };
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [selectedColor, setSelectedColor] = useState("#B38BFA");
  const [notesDetails, setNotesDetails] = useState(() =>
    localStorage.getItem("notes")
      ? JSON.parse(localStorage.getItem("notes"))
      : []
  );

  const [showNotes, setShowNotes] = useState(false);
  const [selectedGroupName, setSelectedGroupName] = useState({});
  const [noteContent, setNoteContent] = useState("");
  const [showSendBtn, setShowSendBtn] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleBackButtonClick = () => {
    setShowNotes(false);
    setSelectedGroupName({});
    setNoteContent("");
  };

  //console.log(selectedGroupName);
  const showModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    //console.log("Form submitted:", groupName, selectedColor);
    const note = {
      id: Date.now(),
      groupName,
      selectedColor,
      notes: [],
    };

    const updatedNotesDetails = [...notesDetails, note];
    setNotesDetails(updatedNotesDetails);
    localStorage.setItem("notes", JSON.stringify(updatedNotesDetails));
    closeModal();
  };

  const handleNoteSubmit = (e) => {
    e.preventDefault();

    //console.log("Form submitted:", noteContent);
    const note = {
      id: Date.now(),
      noteContent,
      date: new Date()
        .toLocaleString("en-US", options)
        .replace(",", " •")
        .replace(",", ""),
    };

    const updatedNotes = [...selectedGroupName.notes, note];
    const updatedGroupName = { ...selectedGroupName, notes: updatedNotes };
    setSelectedGroupName(updatedGroupName);

    const updatedNotesDetails = notesDetails.map((note) => {
      if (note.id === selectedGroupName.id) {
        return { ...note, notes: updatedNotes };
      }
      return note;
    });
    setNotesDetails(updatedNotesDetails);
    localStorage.setItem("notes", JSON.stringify(updatedNotesDetails));
    setNoteContent("");
    setShowSendBtn(false);
  };

  return (
    <div className={styles.notesAppContainer}>
      <div
        className={styles.notesList}
        style={{
          display: showNotes && isSmallScreen ? "none" : "flex",
          height: isSmallScreen ? "100vh" : "",
          overflowY: "hidden",
          overflowX: "hidden",
        }}
      >
        <h2>Pocket Notes</h2>
        <button onClick={showModal}>
          <h1
            style={{
              fontSize: isSmallScreen ? "2.6rem" : "5rem",
              color: "white",
            }}
          >
            +
          </h1>{" "}
        </button>
        <div className={styles.notesListContainer}>
          {notesDetails.map((note) => {
            const { id, groupName, selectedColor } = note;
            const name = getFirstLetters(groupName);
            return (
              <div
                className={styles.notesListItem}
                key={id}
                onClick={() => {
                  setSelectedGroupName({
                    id,
                    groupName,
                    name,
                    selectedColor,
                    notes: note.notes,
                  });
                  setShowNotes(true);
                  return;
                }}
                data-selected={selectedGroupName.id === id}
              >
                <div
                  style={{
                    marginLeft: "1rem",
                    backgroundColor: selectedColor,
                    width: "50px",
                    height: "50px",
                    borderRadius: "50%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    color: "white",
                    fontSize: "1.2rem",
                  }}
                >
                  {name}
                </div>
                <div
                  style={{
                    flexGrow: 1,
                  }}
                >
                  <h2
                    style={{
                      fontWeight: "normal",
                      fontSize: "1.5rem",
                      display: "flex",
                      justifyContent: "start",
                      alignItems: "center",
                    }}
                  >
                    {groupName}
                  </h2>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {/* Modal Overlay */}
      {isModalOpen && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modalContent}>
            <h2
              style={{
                marginBottom: "1rem",
                fontSize: "1.5rem",
                fontWeight: "600",
                letterSpacing: "1px",
                lineHeight: "2",
              }}
            >
              Create New Group
            </h2>
            <form onSubmit={handleSubmit}>
              <div className={styles.inputGroup}>
                <label>Group Name</label>
                <input
                  type="text"
                  placeholder="Enter group name"
                  onChange={(e) => setGroupName(e.target.value)}
                  required
                />
              </div>
              <div className={styles.colorSelection}>
                <label>Choose Color</label>
                <div className={styles.colorOptions}>
                  {[
                    "#B38BFA",
                    "#FF79F2",
                    "#43E6FC",
                    "#F19576",
                    "#0047FF",
                    "#6691FF",
                  ].map((color) => (
                    <div
                      key={color}
                      className={styles.colorOption}
                      style={{ backgroundColor: color }}
                      onClick={() => setSelectedColor(color)}
                      data-selected={selectedColor === color}
                    />
                  ))}
                </div>
              </div>
              <button type="submit" className={styles.createButton}>
                Create
              </button>
            </form>
            <button onClick={closeModal} className={styles.closeButton}>
              ×
            </button>
          </div>
        </div>
      )}
      <div
        className={styles.notesContent}
        style={{ display: showNotes || isSmallScreen ? "none" : "flex" }}
      >
        <div>
          <img src={poster} alt="" />
          <h2>Pocket Notes</h2>
          <p>
            Send and receive messages without keeping your phone online <br />
            Use Pocket Notes on upto 4 linked devices and 1 mobile phone
          </p>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            position: "absolute",
            bottom: "3%",
          }}
        >
          <img src={lock} alt="" /> <p>end-to-end encrypted</p>
        </div>
      </div>

      <div
        className="showNotesContent"
        style={{
          width: showNotes ? "100vw" : "80vw",
          height: "100%",
          backgroundColor: "lightblue",
          display: showNotes ? "flex" : "none",
          flexDirection: "column",
        }}
      >
        <header
          style={{
            width: "100%",
            height: "10vh",
            backgroundColor: " #001F8B",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: isSmallScreen ? "" : "0 2rem",
          }}
        >
          {isSmallScreen && (
            <button
              className={styles.backButton}
              onClick={handleBackButtonClick}
              style={{
                background: `url(${backBtn}) no-repeat center center`,
                backgroundSize: "contain",
                width: "20px",
                height: "20px",
                border: "none",
                cursor: "pointer",
              }}
            />
          )}
          <div
            style={{
              backgroundColor: selectedGroupName?.selectedColor,
              width: "50px",
              height: "50px",
              borderRadius: "50%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              color: "white",
              fontSize: "1.2rem",
              marginRight: "1rem",
            }}
          >
            {selectedGroupName?.name}
          </div>
          <div
            style={{
              flexGrow: 1,
              display: "flex",
              justifyContent: "start", // Center the group name
            }}
          >
            <h2
              style={{
                fontWeight: "normal",
                fontSize: "1.5rem",
                display: "flex",
                justifyContent: "start",
                alignItems: "center",
                color: "white",
              }}
            >
              {selectedGroupName?.groupName}
            </h2>
          </div>
        </header>

        <section
          className="notesContentSection"
          style={{
            backgroundColor: "#DAE5F5",
            height: isSmallScreen ? "70vh" : "60vh",
            overflowY: "scroll",
            WebkitScrollbar: "  width: 12px",
            scrollbarWidth: "thin",
            scrollbarColor: "#ffffff #DAE5F5",
            scrollbarTrackColor: "#DAE5F5 ",
            padding: "2rem",
            width: "100%",
          }}
        >
          {selectedGroupName?.notes?.map((note) => {
            return (
              <div
                key={note.id}
                style={{
                  backgroundColor: "#ffffff",
                  padding: "1rem",
                  marginBottom: "1rem",
                  boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.3)",
                }}
              >
                <p
                  style={{
                    padding: "1rem",
                    whiteSpace: "pre-wrap",
                    wordWrap: "break-word",
                    wordBreak: "break-all",
                    lineHeight: "1.5",
                    fontSize: "1rem",
                  }}
                >
                  {note?.noteContent}
                </p>

                <p
                  className="currentDate"
                  style={{
                    textAlign: "right",
                    marginRight: "1rem",
                    position: "relative",
                    bottom: "0.2rem",
                  }}
                >
                  {note?.date}
                </p>
              </div>
            );
          })}
        </section>

        <section
          className="notesInputSection"
          style={{
            backgroundColor: "#001F8B",
            height: isSmallScreen ? "20%" : "30vh",
            padding: isSmallScreen ? "1rem" : "2rem",
            overflowY: "hidden",
          }}
        >
          <div
            style={{
              backgroundColor: "#FFFFFF",
              width: "100%",
              height: "100%",
              position: "relative",
            }}
          >
            <textarea
              name="noteContent"
              id="noteContent"
              type="text"
              value={noteContent}
              placeholder="Enter your text here ..."
              style={{
                width: "100%",
                height: "100%",
                border: "none",
                padding: "1rem",
                resize: "none",
                boxSizing: "border-box",
                fontSize: "1rem",
              }}
              onChange={(e) => {
                setNoteContent(e.target.value);
                setShowSendBtn(e.target.value.length > 0);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault(); // Always prevent default behavior comments for reference
                  if (e.target.value.trim().length > 0) {
                    handleNoteSubmit(e);
                  }
                }
              }}
            ></textarea>
            {showSendBtn && (
              <button onClick={handleNoteSubmit}>
                <img
                  src={sendBtn}
                  alt=""
                  srcSet=""
                  style={{
                    position: "absolute",
                    right: "1%",
                    bottom: "1%",
                    top: isSmallScreen ? "50%" : "80%",
                    cursor: "pointer",
                  }}
                />
              </button>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};
export default Notes;
