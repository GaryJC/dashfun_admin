import { Modal, Typography } from "antd";
import { useEffect, useState } from "react";
import API, { requestWithAuthHeader } from "../../modules/api";

export default function GameTaskModal({
  gameID,
  taskModalOpen,
  closeTaskModal,
}) {
  const [task, setTask] = useState({});
  const [loading, setLoading] = useState(false);

  console.log("gameID", gameID);

  useEffect(() => {
    const fetchTask = async () => {
      setLoading(true);
      try {
        const res = await requestWithAuthHeader.post(API.getTaskInfo(gameID));
        const { code, data, msg } = res.data;
        console.log("res", code, data, msg);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchTask();
  }, [gameID]);

  return (
    <Modal
      title="Task"
      open={taskModalOpen}
      onCancel={closeTaskModal}
      footer={null}
    >
      <div>
        <h1>Task</h1>
        <p>Task description</p>
      </div>
    </Modal>
  );
}
