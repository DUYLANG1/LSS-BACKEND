# Cleanup Instructions

After refactoring the project to a domain-driven structure, the following files and folders should be deleted as they are no longer needed:

## Folders to Delete

1. `/src/modules/` - This entire directory should be deleted since we've moved all modules to `/src/domains/`

2. `/src/common/` - This directory is replaced by the new `/src/core/` directory

## Files to Check and Delete if Present

The following files may or may not exist in your project. If they do exist, they should be deleted as their functionality has been moved to the domain-specific modules:

1. `/src/app.controller.ts` - If present, functionality has been moved to domain controllers
2. `/src/app.controller.spec.ts` - If present, associated test file
3. `/src/app.service.ts` - If present, functionality has been moved to domain services

## How to Delete

You can delete these files and folders using your file explorer or using the following commands in your terminal:

```bash
# Delete modules folder
rm -rf src/modules

# Delete common folder
rm -rf src/common

# Delete app controller and service files (if they exist)
rm -f src/app.controller.ts
rm -f src/app.controller.spec.ts
rm -f src/app.service.ts
```

## Where the Functionality Moved

If your project had an AppController or AppService, their functionality has been distributed to the appropriate domain modules:

1. **Basic API endpoints** - Moved to domain-specific controllers (e.g., AuthController, UsersController)
2. **Health checks** - Moved to the dedicated HealthController in the health module
3. **Authentication logic** - Moved to the AuthService in the auth domain
4. **General utility functions** - Moved to appropriate services in their respective domains

## Note

Before deleting, ensure that:

1. All functionality from these files has been properly migrated to the new structure
2. The application still builds and runs correctly
3. You have a backup or your changes are committed to version control

After cleanup, run the application to verify everything works as expected.
