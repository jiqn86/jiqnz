import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewJiqnzComponent } from './new-jiqnz.component';

describe('NewJiqnzComponent', () => {
  let component: NewJiqnzComponent;
  let fixture: ComponentFixture<NewJiqnzComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewJiqnzComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewJiqnzComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
