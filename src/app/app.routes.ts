import { Routes } from '@angular/router';

import { Login } from './auth/login/login';
import { Register } from './auth/register/register';
import { Home } from './home/home';

import { Dashboard } from './admin/dashboard/dashboard';
import { Users } from './admin/users/users';
import { Layout } from './admin/layout/layout';

import { HrDashboard } from './hr/hr-dashboard/hr-dashboard';
import { HrLayout } from './hr/hr-layout/hr-layout';
import { HrJobs } from './hr/hr-jobs/hr-jobs';
import { CreateJob } from './hr/create-job/create-job';
import { JobDetails } from './hr/job-details/job-details';
import { EditJob } from './hr/edit-job/edit-job';
import { Applicants } from './hr/applicants/applicants';
import { CandidateLayout } from './candidate/candidate-layout/candidate-layout';
import { CandidateDashboard } from './candidate/candidate-dashboard/candidate-dashboard';
import { CandidateJobs } from './candidate/candidate-jobs/candidate-jobs';
import { CandidateJobDetails } from './candidate/candidate-job-details/candidate-job-details';
import { CandidateApplications } from './candidate/candidate-applications/candidate-applications';
import { CInterviews } from './candidate/c-interviews/c-interviews';
import { HInterviews } from './hr/h-interviews/h-interviews';
import { CProfile } from './candidate/c-profile/c-profile';
import { CSettings } from './candidate/c-settings/c-settings';
import { AAnalytics } from './admin/a-analytics/a-analytics';



export const routes: Routes = [
    //Admin
    {
        path: 'admin',
        component: Layout,
        children: [
            // {
            //     path: '',
            //     redirectTo: 'dashboard'
            // },
            {
                path: 'dashboard',
                component: Dashboard
            },
            {
                path: 'users',
                component: Users
            },
            {
                path: 'analytics',
                component: AAnalytics
            },
        ]

    },

    //hr
    {
        path: 'hr',
        component: HrLayout,
        children: [

            {
                path: '',
                redirectTo: 'dashboard',
                pathMatch: 'full'
            },

            {
                path: 'dashboard',
                component: HrDashboard
            },
            {
                path: 'jobs',
                component: HrJobs
            },
            {
                path: 'create-job',
                component: CreateJob
            },
            {
                path: 'jobs/:id',
                component: JobDetails
            },
            {
                path: 'jobs/edit/:id',
                component: EditJob
            },
            {
                path: 'applicants',
                component: Applicants
            },
            {
                path: 'interviews',
                component: HInterviews
            },

        ]
    },

    //Candidate
    {
        path:'candidate',
        component:CandidateLayout,
        children:[
            {
                path:'',
               redirectTo: 'dashboard',
               pathMatch:'full'
            },
            {
                path:'dashboard',
                component:CandidateDashboard
            },
            {
                path:'jobs',
                component:CandidateJobs
            },
            {
                path:'jobs/:id',
                component:CandidateJobDetails
            },
            {
                path:'applications',
                component:CandidateApplications
            },
            {
                path:'interviews',
                component:CInterviews
            },
            {
                path:'profile',
                component:CProfile
            },
            {
                path:'settings',
                component:CSettings
            },
        ]
    },

    //common
    {
        path: '', component: Home
    },
    {
        path: 'register', component: Register
    },
    {
        path: 'login', component: Login
    },

];
