import { Component, OnInit } from '@angular/core';
import { Admin } from '../../services/admin';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-users',
  imports: [CommonModule, FormsModule],
  templateUrl: './users.html',
  styleUrl: './users.css',
})
export class Users implements OnInit {
  users: any[] = [];

  loading = true;

  //search
  searchTerm = '';
  filteredUsers: any[] = [];

  toastVisible = false;
  toastMessage = '';
  toastType: 'success' | 'error' = 'success';
  private toastTimer: any = null;

  constructor(private adminService: Admin) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  showToast(message: string, type: 'success' | 'error'): void {
    this.toastMessage = message;
    this.toastType = type;
    this.toastVisible = true;

    if (this.toastTimer) {
      clearTimeout(this.toastTimer);
    }

    this.toastTimer = setTimeout(() => {
      this.toastVisible = false;
    }, 3500);
  }

  closeToast(): void {
    if (this.toastTimer) {
      clearTimeout(this.toastTimer);
    }
    this.toastVisible = false;
  }

  searchUsers() {

    const search = this.searchTerm
      .trim()
      .toLowerCase();

    this.filteredUsers =
      this.users.filter(user => {

        return (
          user.username
            ?.toLowerCase()
            .includes(search) ||

          user.email
            ?.toLowerCase()
            .includes(search) ||

          user.role
            ?.toLowerCase()
            .includes(search)
        );

      });

  }

  loadUsers() {
    this.loading = true;

    this.adminService.getAllUsers()
      .subscribe({
        next: (res) => {

          console.log('Users:', res);
          this.users = res.users;
          this.filteredUsers = [...this.users];
          this.loading = false;

        },

        error: (err) => {
          console.log('Failed to load users:', err);
          this.showToast('Failed to load users. Please try again.', 'error');
          this.loading = false;

        }
      })
  }


  updateStatus(user: any) {

    const newStatus =
      user.status === 'active' ? 'inactive' : 'active';

    this.adminService.updateUserStatus(user._id, newStatus).subscribe({

      next: (res) => {

        console.log('User status updated:', res);
        user.status = newStatus;
        this.showToast(`User ${user.username} ${newStatus === 'active' ? 'activated' : 'deactivated'}.`, 'success');
      },

      error: (err) => {
        console.log('Failed to update user status:', err);
        this.showToast('Failed to update user status. Please try again.', 'error');
      }
    });

  }

  
  updateRole(user: any, event: Event) {

    const selectElement = event.target as HTMLSelectElement;

    const newRole = selectElement.value;

    this.adminService.updateUserRole(user._id, newRole).subscribe({

      next: (res) => {

        console.log('User role updated:', res);
        user.role = newRole;
        this.showToast(`Role updated to ${newRole}.`, 'success');

      },

      error: (err) => {
        console.log('Failed to update user role:', err);

        // Restore previous role if API fails
        selectElement.value = user.role;
        this.showToast('Failed to update user role. Please try again.', 'error');
      }

    });

  }

}
