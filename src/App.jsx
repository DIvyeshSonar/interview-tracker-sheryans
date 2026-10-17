import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import { SAMPLE_MACHINE, SAMPLE_QUESTIONS, STORAGE_KEYS } from "./constants";
import { useLocalStorage } from "./hooks/useLocalStorage";
import Dashboard from "./pages/Dashboard.jsx";
import QuestionFormPage from "./pages/QuestionFormPage.jsx";
import Questions from "./pages/Questions.jsx";
import { uid } from "./utils";

export default function App() {
  const [questions, setQuestions] = useLocalStorage(STORAGE_KEYS.questions, []);
  const [machine, setMachine] = useLocalStorage(STORAGE_KEYS.machineCoding, {
    title: "",
    status: "Not started",
    notes: "",
    updatedAt: null,
  });

  function saveQuestion(payload, editId) {
    const now = new Date().toISOString();
    if (editId) {
      setQuestions((list) =>
        list.map((q) => (q.id === editId ? { ...q, ...payload, updatedAt: now } : q))
      );
    } else {
      setQuestions((list) => [{ id: uid(), createdAt: now, updatedAt: now, ...payload }, ...list]);
    }
  }

  function deleteQuestion(id) {
    const item = questions.find((q) => q.id === id);
    if (!item) return;
    if (!window.confirm(`Remove “${item.title}”? This cannot be undone.`)) return;
    setQuestions((list) => list.filter((q) => q.id !== id));
  }

  function updateStatus(id, status) {
    setQuestions((list) =>
      list.map((item) =>
        item.id === id ? { ...item, status, updatedAt: new Date().toISOString() } : item
      )
    );
  }

  function loadSamples() {
    const now = new Date().toISOString();
    setQuestions(
      SAMPLE_QUESTIONS.map((q) => ({
        ...q,
        id: uid(),
        createdAt: now,
        updatedAt: now,
      }))
    );
    setMachine({ ...SAMPLE_MACHINE, updatedAt: now });
  }

  function saveMachine(payload) {
    setMachine({
      ...payload,
      updatedAt: new Date().toISOString(),
    });
  }

  return (
    <Layout onLoadSamples={loadSamples}>
      <Routes>
        <Route
          path="/"
          element={
            <Dashboard questions={questions} machine={machine} onSaveMachine={saveMachine} />
          }
        />
        <Route
          path="/questions"
          element={
            <Questions
              questions={questions}
              onStatus={updateStatus}
              onDelete={deleteQuestion}
              onLoadSamples={loadSamples}
            />
          }
        />
        <Route
          path="/questions/new"
          element={<QuestionFormPage questions={questions} onSave={saveQuestion} />}
        />
        <Route
          path="/questions/:id/edit"
          element={<QuestionFormPage questions={questions} onSave={saveQuestion} />}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <style>{`
        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          border: 0;
        }
      `}</style>
    </Layout>
  );
}
