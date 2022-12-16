import { useState } from 'react';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import styled from 'styled-components';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import { useStyles } from '../hooks';
import axios from '../api';
import { useScoreCard } from '../hooks/useScoreCard';
import Table from './Table';


const Wrapper = styled.section`
  display: flex;
  flex-direction: column;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 1em;
`;

const ContentPaper = styled(Paper)`
  height: 40px;
  padding: 2em;
  overflow: auto;
`;

const AddPanel = () => {
  const classes = useStyles();

  const { messages, addCardMessage, addErrorMessage } =
    useScoreCard();

  const [name, setName] = useState('');
  const [subject, setSubject] = useState('');
  const [score, setScore] = useState(0);
  const [dataTable, setDataTable] = useState([]);

  const handleChange = (func) => (event) => {
    func(event.target.value);
  };

  const handleAdd = async () => {
    const {
      data: { message, card },
    } = await axios.post('/card', {
      name,
      subject,
      score,
    });

    if (!card) addErrorMessage(message);
    else addCardMessage(message);
    handleQuery();
  };

  const handleQuery = async () => {
    const {
      data: { messages, message },
    } = await axios.get('/cardTable', {
      params: {
        type: 'name',
        queryString: name,
      },
    });

    if (!messages) setDataTable([]);
    else {
      setDataTable(messages);
      console.log(messages);
    };
  };

  return (
    <Wrapper>
      <Row>
        <TextField
          className={classes.input}
          placeholder="Name"
          value={name}
          onChange={handleChange(setName)}
        />
        <TextField
          className={classes.input}
          placeholder="Subject"
          style={{ width: 240 }}
          value={subject}
          onChange={handleChange(setSubject)}
        />
        <TextField
          className={classes.input}
          placeholder="Score"
          value={score}
          onChange={handleChange(setScore)}
          type="number"
        />
        <Button
          className={classes.button}
          variant="contained"
          color="primary"
          disabled={!name || !subject}
          onClick={handleAdd}
        >
          Add
        </Button>
      </Row>
      <ContentPaper variant="outlined">
        {messages.map((m, i) => (
          <Typography variant="body2" key={m + i} style={{ color: m.color }}>
            {m.message}
          </Typography>
        ))}

      </ContentPaper>
      <Table rows={dataTable} />
    </Wrapper>
  );
};

export default AddPanel;
