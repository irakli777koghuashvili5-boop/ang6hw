import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecoverPasscode } from './recover-passcode';

describe('RecoverPasscode', () => {
  let component: RecoverPasscode;
  let fixture: ComponentFixture<RecoverPasscode>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecoverPasscode],
    }).compileComponents();

    fixture = TestBed.createComponent(RecoverPasscode);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
