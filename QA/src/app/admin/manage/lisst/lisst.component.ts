import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';
interface User {
  username: string;
  password: string;
  role: string;
  name: string;
  shift: string;
  date: string;
  time: string;
}

@Component({
    selector: 'app-lisst',
    templateUrl: './lisst.component.html',
    styleUrls: ['./lisst.component.scss'],
    standalone: false
})
export class LisstComponent implements OnInit {
  isFormOpen = false;
  isEdit = false;
  filter = '';
  users: User[] = [];
  userFormData: User = {
    username: '',
    password: '',
    role: '',
    name: '',
    shift: '',
    date: '',
    time: ''
  };
  filteredUsers: User[] = [];  // เก็บผลลัพธ์หลังจากการกรอง
  paginatedUsers: User[] = [];
  pageIndex = 0;
  pageSize = 10;
  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getUsers();  // เรียกใช้เมื่อ component โหลด
  }

  
  getUsers(): void {
    this.http.get<User[]>('http://localhost:3000/employees')
      .subscribe(data => {
        this.users = data;
        this.applyFilter();
      }, err => {
        console.error('Error fetching users', err);
      });
  }

  // ฟังก์ชันกรองผู้ใช้
  applyFilter(): void {
    if (this.filter) {
      this.filteredUsers = this.users.filter(user =>
        user.username.toLowerCase().includes(this.filter.toLowerCase()) ||
        user.role.toLowerCase().includes(this.filter.toLowerCase())
      );
    } else {
      this.filteredUsers = [...this.users];
    }
    this.updatePagination();
  }

  // ฟังก์ชันแบ่งหน้า
  updatePagination(): void {
    const startIndex = this.pageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedUsers = this.filteredUsers.slice(startIndex, endIndex);
  }

  onPageChange(event: any): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updatePagination();
  }

  // ฟังก์ชันเพิ่มผู้ใช้
  openAddUserForm(): void {
    this.isFormOpen = true;
    this.isEdit = false;
    this.userFormData = { username: '', password: '', role: '', name: '', shift: '', date: '', time: '' };
  }

  // ฟังก์ชันแก้ไขผู้ใช้
  openEditUserForm(user: User): void {
    this.isFormOpen = true;
    this.isEdit = true;
    const localDate = new Date(user.date).toLocaleDateString('en-CA'); // 'en-CA' format => yyyy-MM-dd
    this.userFormData = { ...user, date: localDate };
  }

  // ฟังก์ชันปิดฟอร์ม
  closeForm(): void {
    this.isFormOpen = false;
  }

  // ฟังก์ชันลบผู้ใช้
  deleteUser(user: User): void {
    Swal.fire({
      title: 'Are you sure?',
      text: `Do you really want to delete the user ${user.username}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.http.delete(`http://localhost:3000/employees/${user.username}`)
          .subscribe(() => {
            this.users = this.users.filter(u => u.username !== user.username);
            this.applyFilter();
            Swal.fire(
              'Deleted!',
              `User ${user.username} has been deleted.`,
              'success'
            );
          }, err => {
            console.error('Error deleting user', err);
            Swal.fire(
              'Error!',
              'There was an issue deleting the user.',
              'error'
            );
          });
      }
    });
  }

  // ฟังก์ชัน submit ฟอร์ม
  onSubmit(): void {
    if (this.isEdit) {
      this.updateUser(this.userFormData);
    } else {
      this.addUser(this.userFormData);
    }
  }

  // ฟังก์ชันเพิ่มผู้ใช้
  addUser(user: User): void {
    this.http.post('http://localhost:3000/employees', user)
      .subscribe(() => {
        this.getUsers();
        this.closeForm();
        Swal.fire({
          icon: 'success',
          title: 'User Added',
          text: 'User has been added successfully.',
        });
      }, err => {
        console.error('Error adding user', err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Unable to add user. Please try again.',
        });
      });
  }

  // ฟังก์ชันอัปเดตผู้ใช้
  updateUser(user: User): void {
    this.http.put(`http://localhost:3000/employees/${user.username}`, user)
      .subscribe(() => {
        this.getUsers();
        this.closeForm();
        Swal.fire({
          icon: 'success',
          title: 'User Updated',
          text: 'User data has been updated successfully.',
        });
      }, err => {
        console.error('Error updating user', err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Unable to update user. Please try again.',
        });
      });
  }

  // ฟังก์ชัน export ข้อมูล
  onExportClick(): void {
    if (this.users.length === 0) {
      console.warn('No data to export');
      return;
    }
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.users);
    const workbook: XLSX.WorkBook = {
      Sheets: { 'Users': worksheet },
      SheetNames: ['Users']
    };
    XLSX.writeFile(workbook, 'users.xlsx');
  }
}