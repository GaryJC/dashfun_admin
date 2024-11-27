import Constants from "../../modules/constants";

const { Task } = Constants;

export const clearFormErrors = (form) => {
    const fields = form.getFieldsValue(); // Get all form field values
    const fieldNames = Object.keys(fields); // Extract field names from the values
  
    // For each field, reset the errors to an empty array
    const resetErrors = fieldNames.map((fieldName) => ({
      name: fieldName,
      errors: [], // Clear errors
    }));
  
    form.setFields(resetErrors); // Apply the error clearing
  };

export const formValidationHandler = (form, values, setLoading)=>{
    const gameID = form.getFieldValue("game_id");
    console.log("gameID", gameID);
    const taskType = values.require?.type;
    let validated = true;
  
    // Validation based on task.require.type
    if (taskType === Task.RequireType.PlayRandomGame) {
      // PlayRandomGame requires game_id to be empty
      if (gameID) {
        form.setFields([
          {
            name: "game_id",
            errors: ["Game ID must be empty for 'Play Random Game' task type."],
          },
        ]);
        setLoading(false);
        validated = false;
      }
      // Validate 'count' for PlayRandomGame
      if (!values.require.count || values.require.count <= 0) {
        form.setFields([
          {
            name: ["require", "count"],
            errors: ["'Count' must be a positive number."],
          },
        ]);
        setLoading(false);
        validated = false;
      }
    }
  
    if (taskType === Task.RequireType.PlayGame || taskType === Task.RequireType.LevelUp || taskType === Task.RequireType.SpendTGStars) {
      // PlayGame, LevelUp, SpendTGStars require game_id to be not empty
      if (!gameID) {
        form.setFields([
          {
            name: "game_id",
            errors: ["Game ID is required for the selected task type."],
          },
        ]);
        setLoading(false);
        validated = false;
      }
      // Validate 'count' for PlayGame, LevelUp, and SpendTGStars
      if (!values.require.count || values.require.count <= 0) {
        form.setFields([
          {
            name: ["require", "count"],
            errors: ["'Count' must be a positive number."],
          },
        ]);
        setLoading(false);
        validated = false;
      }
    }
  
    if (taskType === Task.RequireType.JoinTGChannel || taskType === Task.RequireType.FollowX) {
      // JoinTGChannel and FollowX do not require game_id to be assigned
      // Validate 'count' to be 1 for both
      if (values.require.count !== 1) {
        form.setFields([
          {
            name: ["require", "count"],
            errors: ["'Count' must be 1 for 'JoinTGChannel' and 'FollowX' tasks."],
          },
        ]);
        setLoading(false);
        validated = false;
      }
  
      // Validate 'condition' for JoinTGChannel
      if (taskType === Task.RequireType.JoinTGChannel && (!values.require.condition || values.require.condition.trim() === "")) {
        form.setFields([
          {
            name: ["require", "condition"],
            errors: ["'Condition' (TG chat group ID) is required for 'JoinTGChannel' task."],
          },
        ]);
        setLoading(false);
        validated = false;
      }
  
      // Validate 'link' for JoinTGChannel and FollowX
      if (!values.require.link || values.require.link.trim() === "") {
        form.setFields([
          {
            name: ["require", "link"],
            errors: ["'Link' is required for 'JoinTGChannel' and 'FollowX' tasks."],
          },
        ]);
        setLoading(false);
        validated = false;
      }
    }
    return validated;
  }