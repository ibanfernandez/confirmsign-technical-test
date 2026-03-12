import { useState } from "react";
import "./Forms.scss";

/**
 * Renders a CHECK question as a group of checkboxes (one per option).
 */
function CheckQuestion({ question, disabled, formAnswers, onAnswerChange }) {
  const answers = formAnswers[question.qid] || {};

  const handleChange = (oid, checked) => {
    onAnswerChange(question.qid, { ...answers, [oid]: checked });
  };

  return (
    <div className="checkbox-group" role="group" aria-label={question.label}>
      {question.options.map((option) => (
        <label
          key={option.oid}
          className={`checkbox-option${disabled ? " checkbox-option--disabled" : ""}`}
        >
          <input
            type="checkbox"
            className="checkbox-option__input"
            disabled={disabled}
            checked={answers[option.oid] ?? option.default ?? false}
            onChange={(e) => handleChange(option.oid, e.target.checked)}
          />
          <span
            className={`checkbox-option__label${disabled ? " checkbox-option__label--disabled" : ""}`}
          >
            {option.label}
          </span>
        </label>
      ))}
    </div>
  );
}

/**
 * Renders a TEXT question as an input field.
 */
function TextQuestion({ question, disabled, formAnswers, onAnswerChange }) {
  const option = question.options[0];
  const inputConfig = option?.input || {};
  const value = formAnswers[question.qid]?.text || "";

  const handleChange = (e) => {
    onAnswerChange(question.qid, { text: e.target.value });
  };

  return (
    <input
      type="text"
      className="text-input"
      disabled={disabled}
      placeholder={option?.label || ""}
      minLength={inputConfig.min}
      maxLength={inputConfig.max}
      value={value}
      onChange={handleChange}
      aria-label={question.label}
    />
  );
}

/**
 * Renders a single question (label + control).
 */
function FormQuestion({ question, disabled, formAnswers, onAnswerChange }) {
  return (
    <div className="form-question">
      <span
        className={`form-question__label${disabled ? " form-question__label--disabled" : ""}`}
      >
        {question.label}
        {question.required && (
          <span className="form-question__label-required">*</span>
        )}
      </span>
      <div className="form-question__controls">
        {question.type === "CHECK" && (
          <CheckQuestion
            question={question}
            disabled={disabled}
            formAnswers={formAnswers}
            onAnswerChange={onAnswerChange}
          />
        )}
        {question.type === "TEXT" && (
          <TextQuestion
            question={question}
            disabled={disabled}
            formAnswers={formAnswers}
            onAnswerChange={onAnswerChange}
          />
        )}
      </div>
    </div>
  );
}

/**
 * Renders a single form (title + list of questions).
 */
function FormSection({ form, disabled, formAnswers, onAnswerChange }) {
  return (
    <section className="form-section">
      {form.title && <h3 className="form-section__title">{form.title}</h3>}
      {form.questions?.map((question) => (
        <FormQuestion
          key={question.qid}
          question={question}
          disabled={disabled}
          formAnswers={formAnswers[form.fid] || {}}
          onAnswerChange={(qid, value) => onAnswerChange(form.fid, qid, value)}
        />
      ))}
    </section>
  );
}

/**
 * Main Forms component — renders all forms in the agreement.
 */
export default function Forms({ forms, disabled }) {
  // formAnswers: { [fid]: { [qid]: value } }
  const [formAnswers, setFormAnswers] = useState({});

  const handleAnswerChange = (fid, qid, value) => {
    setFormAnswers((prev) => ({
      ...prev,
      [fid]: {
        ...(prev[fid] || {}),
        [qid]: value,
      },
    }));
  };

  if (!forms || forms.length === 0) return null;

  return (
    <div>
      {forms.map((form) => (
        <FormSection
          key={form.fid}
          form={form}
          disabled={disabled}
          formAnswers={formAnswers}
          onAnswerChange={handleAnswerChange}
        />
      ))}
    </div>
  );
}
