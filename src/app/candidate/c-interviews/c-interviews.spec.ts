import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CInterviews } from './c-interviews';

describe('CInterviews', () => {
  let component: CInterviews;
  let fixture: ComponentFixture<CInterviews>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CInterviews]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CInterviews);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
