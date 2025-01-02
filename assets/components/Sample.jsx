import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  background-color: #f1f1f1;
  font-family: Arial, sans-serif;
`;

const PageTitle = styled.h1`
  color: #333;
  margin-bottom: 2rem;
`;

const ErrorMessage = styled.p`
  color: #ff0000;
  margin-bottom: 1rem;
`;

const DateTimeContainer = styled.div`
  background-color: #fff;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
  width: 100%;
  max-width: 600px;
`;

const DateTimeHeading = styled.h3`
  color: #333;
  margin-bottom: 1rem;
`;

const ClassSelectionForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const ClassSelectionItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const ClassCheckbox = styled.input`
  margin-right: 0.5rem;
`;

const ClassLabel = styled.label`
  color: #333;
`;

const SubmitButton = styled.button`
  background-color: #007bff;
  color: #fff;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 1rem;

  &:hover {
    background-color: #0056b3;
  }
`;

const LoadingMessage = styled.p`
  color: #666;
`;

const Sample = () => {
  const [uniqueValues, setUniqueValues] = useState([]);
  const [selectedClasses, setSelectedClasses] = useState({});
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:8000/unique-values")
      .then((response) => {
        setUniqueValues(response.data);
      })
      .catch((error) => {
        console.error("Error fetching unique values:", error);
        setError("Unable to fetch data. Please try again.");
      });
  }, []);

  const handleCheckboxChange = (date, time, classId) => {
    const key = `${date}_${time}`;
    setSelectedClasses((prevState) => ({
      ...prevState,
      [key]: {
        ...prevState[key],
        [classId]: !prevState[key]?.[classId],
      },
    }));
  };

  const handleSubmit = (date, time) => {
    console.log("Date:", date);
    console.log("Time:", time);
    const key = `${date}_${time}`;
    const selected = selectedClasses[key]
      ? Object.entries(selectedClasses[key])
          .filter(([_, isChecked]) => isChecked)
          .map(([classId]) => {
            const classData = uniqueValues
              .find((item) => item.date === date && item.time === time)
              .classes.find((cls) => cls.classid === parseInt(classId));
            return {
              className: classData.classname,
              classId: classData.classid,
            };
          })
      : [];

    console.log("Submitting classes:", selected);
    axios
      .post(`http://localhost:8000/submit-available-classes/${date}/${time}`, {
        classes: selected,
      })
      .then(() => {
        alert("Classes submitted successfully!");
        setSelectedClasses((prevState) => {
          const { [key]: _, ...rest } = prevState;
          return rest;
        });
      })
      .catch((error) => {
        console.error("Error submitting classes:", error);
        alert("Error submitting classes. Please try again.");
      });
  };

  return (
    <AppContainer>
      <PageTitle>Unique Values and Class Selection</PageTitle>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      {uniqueValues.length > 0 ? (
        uniqueValues.map(({ date, time, classes }) => (
          <DateTimeContainer key={`${date}_${time}`}>
            <DateTimeHeading>
              Date: {date}, Time: {time}
            </DateTimeHeading>
            <ClassSelectionForm
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit(date, time);
              }}
            >
              {classes.map(({ classname, classid }) => (
                <ClassSelectionItem key={classid}>
                  <ClassCheckbox
                    type="checkbox"
                    id={`${date}_${time}_${classid}`}
                    checked={!!selectedClasses[`${date}_${time}`]?.[classid]}
                    onChange={() => handleCheckboxChange(date, time, classid)}
                  />
                  <ClassLabel htmlFor={`${date}_${time}_${classid}`}>
                    {classname}
                  </ClassLabel>
                </ClassSelectionItem>
              ))}
              <SubmitButton type="submit">Submit</SubmitButton>
            </ClassSelectionForm>
          </DateTimeContainer>
        ))
      ) : (
        <LoadingMessage>Loading unique values...</LoadingMessage>
      )}
    </AppContainer>
  );
};

export default Sample;

// 9000
