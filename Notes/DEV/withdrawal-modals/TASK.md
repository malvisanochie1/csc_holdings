# Withdrawal Modals Redesign

## Tasks
- [x] Create Notes/DEV/withdrawal-modals/ folder and TASK.md
- [x] Create new withdrawal constants file with all modal texts
- [x] Create improved main withdrawal request modal with tab-based design
- [x] Create tax_clearance stage modal component with better design
- [x] Create etf_code stage modal component
- [x] Create entity_pin stage modal component
- [x] Create fscs_code stage modal component
- [x] Create regulation_code stage modal component
- [x] Create withdrawal types file for crypto options
- [x] Update withdrawal stage watcher to use new components
- [x] Test and build to ensure everything works

## Description
Reimplementing withdrawal modals to be stage-specific components rather than dynamic. Each withdrawal stage (tax_clearance, etf_code, entity_pin, fscs_code, regulation_code) will have its own dedicated component with improved UI/UX based on provided designs.

## Requirements
- Better design than current UI
- Tab-based withdrawal method selection
- Modern shadcn pin input components
- Separate components for each stage
- Dynamic content loading from constants
- Clean and structured architecture