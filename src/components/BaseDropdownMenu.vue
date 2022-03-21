<template>
    <b-dropdown size="sm" variant="darker" no-caret toggle-class="d-flex align-items-center">
        <template #button-content>
            <i class="fas fa-ellipsis-v m-0 p-1 px-2 text-muted" aria-hidden="true" style="font-size: 1.5rem"></i>
        </template>
        <!-- <b-dropdown-item to="/tokens"> Tokens </b-dropdown-item> -->
        <b-dropdown-item to="/pools"> Pools </b-dropdown-item>
        <b-dropdown-item to="/integrations"> Integrations </b-dropdown-item>
        <b-dropdown-item to="/account"> Account </b-dropdown-item>
        <b-dropdown-divider />
        <b-dropdown-item to="/signout"> Logout </b-dropdown-item>
    </b-dropdown>
</template>
