import Constants from "../../modules/constants";

const { Task } = Constants;

export const clearFormErrors = (form) => {
    const fields = form.getFieldsValue(); // Get all form field values
    const fieldNames = Object.keys(fields); // Extract field names from the values
  
    // Prepare the reset errors array
    const resetErrors = fieldNames.map((fieldName) => {
      // If the field is a nested field under "require", treat it as a separate field
      if (fieldName === 'require') {
        return [
          { name: ['require', 'count'], errors: [] },
          { name: ['require', 'condition'], errors: [] },
          { name: ['require', 'link'], errors: [] }
        ];
      }
      // Otherwise, clear the error for the current field
      return { name: fieldName, errors: [] };
    }).flat(); // Flatten the array if there are nested fields
  
    form.setFields(resetErrors); // Apply the error clearing
  };
  
  export const formValidationHandler = (form, values, setLoading) => {
    const gameID = form.getFieldValue("game_id");
    const taskType = values.require?.type;
    let validated = true;
  
    const setFieldError = (name, error) => {
      form.setFields([{ name, errors: [error] }]);
      setLoading(false);
      validated = false;
    };
  
    const validateCount = (error) => {
      if (!values.require.count || values.require.count <= 0) {
        setFieldError(["require", "count"], error);
      }
    };
  
    switch (taskType) {
      case Task.RequireType.PlayRandomGame:
        if (gameID) {
          setFieldError("game_id", "Game ID must be empty for 'Play Random Game' task type.");
        }
        validateCount("The times of playing games must be a positive number.");
        break;
  
      case Task.RequireType.PlayGame:
      case Task.RequireType.LevelUp:
      case Task.RequireType.SpendTGStars:
        if (!gameID) {
          setFieldError("game_id", "Game ID is required for the selected task type.");
        }
        if (taskType === Task.RequireType.SpendTGStars) {
          validateCount("The amount of TG stars must be a positive number.");
        } else if (taskType === Task.RequireType.LevelUp) {
          validateCount("The level must be a positive number.");
        } else {
          validateCount("The times of playing games must be a positive number.");
        }
        break;
  
      case Task.RequireType.JoinTGChannel:
      case Task.RequireType.FollowX:
        if (values.require.count !== 1) {
          setFieldError(["require", "count"], "'Count' must be 1 for 'JoinTGChannel' and 'FollowX' tasks.");
        }
        if (taskType === Task.RequireType.JoinTGChannel && (!values.require.condition || values.require.condition.trim() === "")) {
          setFieldError(["require", "condition"], "'Condition' (TG chat group ID) is required for 'JoinTGChannel' task. (eg. @nexgami)");
        }
        if (!values.require.link || values.require.link.trim() === "") {
          setFieldError(["require", "link"], "'Link' is required for 'JoinTGChannel' and 'FollowX' tasks. (eg. https://t.me/nexgami)");
        }
        break;
  
      default:
        break;
    }
  
    return validated;
  };