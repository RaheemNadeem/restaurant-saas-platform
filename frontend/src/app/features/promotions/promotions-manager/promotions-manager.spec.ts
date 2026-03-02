import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PromotionsManager } from './promotions-manager';

describe('PromotionsManager', () => {
  let component: PromotionsManager;
  let fixture: ComponentFixture<PromotionsManager>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PromotionsManager]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PromotionsManager);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
