# Shefaa Admin Dashboard

## Project Summary
An Admin Dashboard to control the Shefaa site

- [Shefaa Admin Dashboard](#shefaa-admin-dashboard)
  - [Project Summary](#project-summary)
  - [Links](#links)
  - [Project Architecture](#project-architecture)
    - [The architecture is based on separating the logic and the presentation and follows the next code:](#the-architecture-is-based-on-separating-the-logic-and-the-presentation-and-follows-the-next-code)
  - [Dependencies](#dependencies)
  - [Helping resources](#helping-resources)
  - [TODO](#todo)



## Links
- Deployment: [Shefaa Admin](https://shefaa-admin.vercel.app/)
- Backend : [Shefaa Backend Repo.](https://github.com/spiritude/shefaa-backend.git)


## Project Architecture
```
src/
├── assets/
│   ├── images/
│   ├── icons/
│   └── ...
│
├── app/
│   ├── api/
│   │   ├── auth.service.ts
│   │   ├── clients.service.ts
│   │   ├── pharmacies.service.ts
│   │   └── index.ts
│   ├── types/
│   ├── utils/
│   │   ├── formatDate.ts
│   │   ├── validate.ts
│   │   └── ...
│   └── ...
│
├── hooks/
│   ├── useAuth.ts
│   ├── useData.ts
│   └── ...
│
├── shared/
│   ├── Layouts/
│   │   ├── AdminLayout.tsx
│   │   ├── AuthLayout.tsx
│   │   └── ...
│   ├── Views/
│   │   ├── NotFound.tsx
│   │   └── ...
│   ├── UI/
│   │   ├── Buttons/
│   │   │   ├── PrimaryButton.tsx
│   │   │   ├── PrimaryButton.stories.tsx
│   │   │   └── index.tsx
│   │   ├── Toasts/
│   │   ├── Inputs/
│   │   └── index.tsx
│   └── ...
│
├── modules/
│   ├── Auth/
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   ├── _components/
│   │   │   ├── LoginForm.tsx
│   │   │   ├── RegisterForm.tsx
│   │   │   └── ...
│   │   └── ...
│   │
│   ├── Clients/
│   │   ├── List.tsx
│   │   ├── Details.tsx
│   │   ├── _components/
│   │   │   ├── ClientsList.tsx
│   │   │   ├── ClientsTable.tsx
│   │   │   └── ...
│   │   └── ...
│   │
│   ├── Pharmacies/
│   │   ├── List.tsx
│   │   ├── Details.tsx
│   │   ├── _components/
│   │   │   ├── PharmaciesList.tsx
│   │   │   ├── PharmaciesTable.tsx
│   │   │   └── ...
│   │   └── ...
│   │
│   ├── Home.tsx
│   └── ...
│
├── store/
│   ├── slices/
│   │   ├── auth.slice.ts
│   │   ├── clients.slice.ts
│   │   ├── pharmacies.slice.ts
│   │   └── ...
│   ├── middlewares/
│   ├── types/
│   ├── store.ts
│   └── ...
│
├── App.tsx
├── main.tsx
├── index.css
├── vite-env.d.ts
└── ...
```

### The architecture is based on separating the logic and the presentation and follows the next code:
- Component folder and file should be named (not index).
- Collection of components, pages, util, ... should be collected in `index.ts` file and exported from it.
- Custom components should be prefixed with `Main...` to avoid conflicts with libraries' components.
- Collecting all similar logic in the same folder (APIs - store - ...)
- Shared components and logic that couldn't be included under any module, should be in the "shared" folder.
- Updates in external library styling should be put in `shared/styles/libs/...` and imported in the `index.css` file inside the same folder.
- Any updates in the architecture itself should be reflected on this graph "just examples".
- Naming convention:
  - `**.slice.ts` for store slice
  - `**.type.ts` for types or `.d.ts` for global shared types
  - `**.service.ts` for api file
- `{<text>}` should be wrapped inside `{t("<text>")}` 


---
## Dependencies
- Form : [React Form Hook](https://react-hook-form.com/get-started/)
- Validation : [Yup](https://github.com/jquense/yup)
- HTTP Client: [axios](https://axios-http.com/)
- UI : Tailwind and Flowbite
- Localization : i18next
- Animation : [React Transition Group](https://reactcommunity.org/react-transition-group/)
---
## Helping resources
 - React Form Hook - [form builder](https://react-hook-form.com/form-builder/)


## TODO
- documenting the pattern of "Services" classes