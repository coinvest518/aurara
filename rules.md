# Development Rules

## General Rules
1. Always address the specific issue mentioned by the user without altering unrelated code.
2. Avoid introducing new errors or removing functionality unless explicitly requested.
3. Ensure all imports are used or removed if unnecessary.
4. Validate and fix lint errors after every edit.

## Feature-Specific Rules
1. For `useSubscription`:
   - Ensure it is properly utilized in the code.
   - Validate the `FeatureKey` type and use correct arguments.
2. For `isTyping`:
   - Ensure the typing indicator is functional and visually clear.

## Workflow Rules
1. Always read the current file contents before making edits.
2. Use comments to represent unchanged code when editing.
3. Confirm fixes for all reported issues before proceeding.
4. Communicate clearly about changes made and any remaining issues.

## Error Handling
1. Address all lint errors immediately.
2. If a type mismatch occurs, verify the type definition and adjust the code accordingly.
3. Avoid deleting code unless explicitly requested.

## User Interaction
1. Follow user instructions precisely.
2. Ask for clarification if the request is ambiguous.
3. Provide updates on progress and confirm fixes.

## File Management
1. Create or update rule files to document recurring issues and solutions.
2. Ensure rule files are accessible and updated regularly.
