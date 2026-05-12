"use client";

import {
  Box,
  Button,
  Container,
  IconButton,
  LinearProgress,
  Modal,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useState, useRef } from "react";
import { z } from "zod";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
import IdentityStep, { identitySchema } from "./Components/IdentityStep";
import SecurityStep, { securitySchema } from "./Components/SecurityStep";
import styles from "./page.module.css";

const fullSchema = identitySchema.merge(securitySchema);

type formType = z.infer<typeof fullSchema>;

const steps = {
  target: "title",
  content: "Hello world",
};

const MultiStepForm = () => {
  const [openOnboarding, setOpenOnboarding] = useState(false);
  const [startOnboarding, setStartOnboarding] = useState(false);
  const onboardingRef = useRef<HTMLElement | null>(null);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<formType>({
    name: "",
    email: "",
    password: "",
  });

  const totalSteps = 2;

  const updateData = (fields: Partial<typeof formData>) => {
    setFormData((prev) => ({ ...prev, ...fields }));
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return <IdentityStep data={formData} update={updateData} />;
      case 2:
        return <SecurityStep data={formData} update={updateData} />;
      default:
        return null;
    }
  };

  const handleNext = () => {
    setStep((s) => Math.min(s + 1, totalSteps));
  };
  const handleBack = () => setStep((s) => Math.max(s - 1, 1));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = fullSchema.safeParse(formData);
    if (result.success) {
      console.log("Final Submission for House Fund:", result.data);
    } else {
      console.log("error", result.error?.format());
    }
  };

  const handleToggleOnboarding = () => {
    setOpenOnboarding((prev) => !prev);
  };

  const handleStartOnboarding = () => {
    setOpenOnboarding((prev) => !prev);
    setStartOnboarding((prev) => !prev);
  };

  return (
    <Container maxWidth="sm" sx={{ pt: 10 }} className={styles.container}>
      {startOnboarding && (
        <Stack>
          <Box ref={onboardingRef} className={styles.onboardingContainer}></Box>
        </Stack>
      )}
      <Box sx={{ width: "100%", mb: 4 }}>
        <Typography variant="caption">
          Step {step} of {totalSteps}
        </Typography>
        <LinearProgress
          variant="determinate"
          value={(step / totalSteps) * 100}
        />
      </Box>

      <form onSubmit={handleSubmit}>
        <Stack spacing={4}>
          {renderStep()}
          <Stack direction="row" spacing={2} justifyContent="space-between">
            <Button
              disabled={step === 1}
              onClick={handleBack}
              variant="outlined"
            >
              Back
            </Button>

            {step < totalSteps ? (
              <Button onClick={handleNext} variant="contained">
                Next
              </Button>
            ) : (
              <Button type="submit" variant="contained" color="success">
                Submit Goal
              </Button>
            )}
          </Stack>
        </Stack>
      </form>
      <Stack className={styles.onboarding}>
        <Tooltip
          title={"onboarding"}
          placement="top"
          onClick={handleToggleOnboarding}
        >
          <IconButton>
            <QuestionMarkIcon />
          </IconButton>
        </Tooltip>
      </Stack>
      {openOnboarding && (
        <Stack className={styles.startOnboarding}>
          <Modal
            open={openOnboarding}
            onClose={handleToggleOnboarding}
            className={styles.onboardingModal}
          >
            <Box>
              <Typography variant="h6">Onboarding</Typography>
              <Button onClick={handleStartOnboarding}>Start onboarding</Button>
            </Box>
          </Modal>
        </Stack>
      )}
    </Container>
  );
};

export default MultiStepForm;
