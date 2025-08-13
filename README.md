# OH YEAH! I'M BUILDING A NEW STRUCTURE

# !IMPORTANT

- This structure use 'npm'
- Follow conventions
- Check node version ( nvmsc ) but Don't worry everything is newest
- Remember 'env'
- Just use color in tailwind or theme system of shacdn

# Next.js Naming Conventions

- Folder Structure: camelCase
- Dynamic route param: snake_case ( [user_id].tsx )
- Hooks: camelCase ( useAuth )
- Component: PascalCase ( PostItem )
- Function / Method: camelCase ( getUserInfo() )
- Constant: SCREAMING_SNAKE_CASE
- Interface / Type (TS): PascalCase
- Enum (TS): PascalCase for Enum name and SCREAMING_SNAKE_CASE for member ( enum UserRole { ADMIN, EDITOR } )

# ICONS AND PUBLIC FOLDER

- USING: [Iconify](https://icon-sets.iconify.design/) and [Lucide](https://lucide.dev/icons/)
- If importing svg or images => Let put it into public folder. !IMPORTANT if it is image, [compress](https://www.iloveimg.com/compress-image) before put into public folder

# [ATOMIC DESIGN](https://viblo.asia/p/tim-hieu-ve-atomic-design-JlkRymxqRZW)

- ATOMIC DESIGN was put in /src/components. In this project we will download from shacdn => it will put into Atoms folders
- Create a folder before you code a new UI ex atom/button/index.tsx
- If you style it by styled-component => atom/button/index.styled.ts
- If you use scss => atom/button/index.scss

# HOOKS ( it like a tool for supporting )

- Create folder before coding ex hooks/useDebounce/index.tsx

# CONTEXTS ( state-management )

- Create folder before coding ex contexts/useAuth/index.tsx

# API

- paths.ts: define api url
- types: name_rule => 'api_name'.type.ts

# VERSION CONTROL

## BRANCH NAMING CONVENTION

- Feature Branches: feature/JIRA-123_implement-property-search
- Bug Fixes: bugfix/JIRA-456_fix-payment-validation
- Hotfixes: hotfix/JIRA-789_critical-security-patch
- Release Branches: release/v1.2.0

## COMMIT MESSAGE STANDARDS

- JIRA-123: Add property search functionality
